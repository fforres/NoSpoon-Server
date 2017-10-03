import * as debug from 'debug';
import * as http from 'http';
import * as webSocket from 'ws';

const d = debug('websocket');
const dh = debug('websocket:heartbeat');
const port = parseInt(process.env.WS_PORT || '3001', 10);

class NoSpoonWebsocketServer extends webSocket.Server {
  public broadcast = (data: INoSpoonMessage) => {
    const message = JSON.stringify(data);
    this.clients.forEach((client: INoSpoonWebSocket) => {
      if (client.isAlive === false) {
        return client.terminate();
      }
      d('Is Attacker %s', !client.attacker);
      if (client.readyState && !client.attacker) {
        client.send(message);
      }
    });
  }
}

const WSS = new NoSpoonWebsocketServer({
  port,
});

interface INoSpoonWebSocket extends webSocket {
  isAlive: boolean | undefined;
  attacker: boolean;
}

enum MessageTypes {
  createBullet = 'createBullet',
  identifyUser = 'identifyUser',
  bulletPosition = 'bulletPosition',
}
type UserTypes = 'attacker' | 'defender';

interface INoSpoonMessage {
  room: string;
  id: string;
  type: MessageTypes;
  user: {
    id: string,
    type: UserTypes;
  };
}

WSS.on('connection', (ws: INoSpoonWebSocket , req: http.IncomingMessage) => {
  // d('received connection from %s', req.connection.remoteAddress);
  setEvents(ws, req);
});

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
    const action: INoSpoonMessage = JSON.parse(message);
    if (action.type === MessageTypes.identifyUser) {
      if (action.user.type === 'attacker') {
        ws.attacker = true;
        // OB.users.attacker[action.user.id] = ws;
      } else {
        ws.attacker = false;
      }
    }
    if (action.type === MessageTypes.createBullet) {}
    if (action.type === ( MessageTypes.bulletPosition as string )) {
      d('Action: %s', action.type);
      d('Action: %s', MessageTypes.bulletPosition);
      WSS.broadcast(action);
    }
    d('received message %o', action);
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
