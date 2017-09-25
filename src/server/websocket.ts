import * as debug from 'debug';
import * as http from 'http';
import * as webSocket from 'ws';

const d = debug('websocket');
const dh = debug('websocket:heartbeat');
const port = parseInt(process.env.WS_PORT || '3001', 10);
const WSS = new webSocket.Server({
  port,
});

interface INoSpoonWebSocket extends webSocket {
  isAlive: boolean | undefined;
}

WSS.on('connection', (ws: INoSpoonWebSocket , req: http.IncomingMessage) => {
  d('received connection from %s', req.connection.remoteAddress);
  setEvents(ws, req);
});

const setEvents = (ws: INoSpoonWebSocket , req: http.IncomingMessage) => {
  ws.isAlive = true;

  ws.on('pong', () => {
    ws.isAlive = true;
    dh('received a pong from %s', req.connection.remoteAddress);

  });

  ws.on('message', handleMessage);

  ws.on('close', (message) => {
    d('Disconnected %s', req.connection.remoteAddress);
    ws.isAlive = false;
  });
};

const handleMessage = (message: webSocket.Data) => {
  d('received message %o', message);
};

// heartbeat
// const interval = setInterval(function ping() {
setInterval(() => {
  WSS.clients.forEach((ws: INoSpoonWebSocket) => {
    if (ws.isAlive === false) {
      return ws.terminate();
    }

    ws.isAlive = false;
    ws.ping('', false, true);
  });
}, 1000);
