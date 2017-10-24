import * as debug from 'debug';
import * as express from 'express';
import * as http from 'http';

import * as webSocket from 'ws';
import {
  INoSpoonMessage,
  INoSpoonWebSocket,
  MessageTypes,
  NoSpoonWebsocketServer,
} from './wss';

const d = debug('websocket');
// const dh = debug('websocket:heartbeat');
const port = parseInt(process.env.PORT || '3001', 10);

const app = express();
const server = http.createServer(app);
server.listen(port);

const WSS = new NoSpoonWebsocketServer({ server, perMessageDeflate: true });
WSS.on('connection', (ws: INoSpoonWebSocket , req: http.IncomingMessage) => setEvents(ws, req));

d('SERVER HTTP + WS CREATED ON PORT %s', port);

const setEvents = (ws: INoSpoonWebSocket , req: http.IncomingMessage) => {
  ws.isAlive = true;
  ws.on('pong', () => {
    ws.isAlive = true;
  });

  ws.on('message', (message) => handleMessage(message, ws));

  ws.on('close', (message: webSocket.Data) => {
    ws.isAlive = false;
    if (typeof message === 'string') {
      const action: INoSpoonMessage = JSON.parse(message);
      d('Disconnected %O', action);
      const customAction: INoSpoonMessage = {
        id: action.id,
        type: MessageTypes.userDisconnected,
        user: action.user,
      };
      WSS.broadcastEveryone(customAction);
    }
    // TODO: broadcast to remove user face -> WSS.broadcast(action);
  });

};

const handleMessage = (message: webSocket.Data | string, ws: INoSpoonWebSocket) => {
  if (typeof message === 'string') {
    try {
      const action: INoSpoonMessage = JSON.parse(message);
      // d('Identifying user %O', action);
      WSS.createUser(action, ws);
      // // // //
      if (action.type === (MessageTypes.RESET as string)) {
        d('WEVE BEEN RESET!');
        WSS.RESET();
      }

      if (action.type === (MessageTypes.userMadeAPoint as string)) {
        // d('A User made a point! %O', action);
        WSS.userMadeAPoint(action, ws);
        WSS.runWinLoop(ws);
      }
      if (action.type === (MessageTypes.createBullet as string)) {
        // d('Creating bullet! %O', action);
        WSS.broadcast(action);
      }
      if (action.type === (MessageTypes.userPosition as string)) {
        // d('USERPOSITION %O', action);
        WSS.userChangedPosition(action, action.position, action.rotation);
      }
      if (action.type === (MessageTypes.bulletPosition as string)) {
        WSS.broadcast(action);
      }

      if (action.type === (MessageTypes.ping as string)) {
        d('PING %O', action);
        ws.ping('', false, true);
      }

    } catch (e) {
      d('========= ERROR!!! =========== \n %O', e);
    }
  }
};

// heartbeat
setInterval(() => {
  WSS.clients.forEach((ws: INoSpoonWebSocket) => {
    // d('TS: %s, %s', ws.isAlive, ws.id);
    if (ws.isAlive === false) {
      return ws.terminate();
    }
    ws.isAlive = false;
    ws.ping('', false, true);
  });
}, 1000);
