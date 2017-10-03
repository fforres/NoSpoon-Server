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
WSS.on('connection', (ws: INoSpoonWebSocket , req: http.IncomingMessage) => setEvents(ws, req));

const setEvents = (ws: INoSpoonWebSocket , req: http.IncomingMessage) => {
  ws.isAlive = true;
  ws.on('pong', () => {
    ws.isAlive = true;
    dh('received a pong from %s', req.connection.remoteAddress);
  });

  ws.on('message', (message) => handleMessage(message, ws));

  ws.on('close', (message) => {
    d('Disconnected %s', req.connection.remoteAddress);
    ws.isAlive = false;
  });

};

const handleMessage = (message: webSocket.Data | string, ws: INoSpoonWebSocket) => {
  if (typeof message === 'string') {
    try {
      const action: INoSpoonMessage = JSON.parse(message);
      d('ACTION %s', action.type);
      d('DATA %O', action);
      if (action.type === (MessageTypes.identifyUser as string)) {
        if (action.user.type === 'attacker') {
          ws.attacker = true;
        } else {
          ws.attacker = false;
        }
      }
      if (action.type === (MessageTypes.createBullet as string)) {}
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
