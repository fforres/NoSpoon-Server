import * as debug from 'debug';
import * as http from 'http';
import * as webSocket from 'ws';
import {
  INoSpoonMessage,
  INoSpoonWebSocket,
  MessageTypes,
  NoSpoonWebsocketServer,
} from './wss';

const d = debug('websocket');
const dh = debug('websocket:heartbeat');
const port = parseInt(process.env.WS_PORT || '3001', 10);

const WSS = new NoSpoonWebsocketServer({ port });
// tslint:disable-next-line
console.log('SERVER CREATED ON PORT ', port);
WSS.on('connection', (ws: INoSpoonWebSocket , req: http.IncomingMessage) => setEvents(ws, req));

const setEvents = (ws: INoSpoonWebSocket , req: http.IncomingMessage) => {
  ws.isAlive = true;
  ws.on('pong', () => {
    dh('received a pong from %s', req.connection.remoteAddress);
    ws.isAlive = true;
  });

  ws.on('message', (message) => handleMessage(message, ws));

  ws.on('close', (message) => {
    d('Disconnected %s', req.connection.remoteAddress);
    ws.isAlive = false;
    if (ws.attacker) {
      WSS.removeAttacker(ws.id);
    } else {
      WSS.removeDefender(ws.id);
    }
  });

};

const handleMessage = (message: webSocket.Data | string, ws: INoSpoonWebSocket) => {
  if (typeof message === 'string') {
    try {
      const action: INoSpoonMessage = JSON.parse(message);
      // d('Identifying user %O', action);
      if (!ws.id && action.user.id) {
        d('%O', action);
        ws.id = action.user.id;
        if (action.user.isDefender) {
          ws.attacker = false;
          WSS.addDefender(ws);
        } else {
          ws.attacker = true;
          WSS.addAttacker(ws);
        }
        ws.send(message);
      }

      // // // //
      if (action.type === (MessageTypes.createBullet as string)) {
        d('Creating bullet! %O', action);
        WSS.sendToDefender(action);
      }
      if (action.type === (MessageTypes.userPosition as string)) {
        WSS.broadcast(action);
      }
      if (action.type === (MessageTypes.bulletPosition as string)) {
        WSS.broadcast(action);
      }
    } catch (e) {
      d('ERROR!!!: %s', e);
    }
  }
};

// heartbeat
// const interval = setInterval(function ping() {
setInterval(() => {
  WSS.clients.forEach((ws: INoSpoonWebSocket) => {
    if (ws.isAlive === false) {
      return ws.terminate();
    }
    // ws.isAlive = false;
    ws.ping('', false, true);
  });
}, 1000);
