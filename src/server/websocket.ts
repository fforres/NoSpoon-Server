import * as d from 'debug';
import * as http from 'http';
import * as webSocket from 'ws';

const debug = d('websocket');
const port = parseInt(process.env.WS_PORT || '3001', 10);
const WSS = new webSocket.Server({
  port,
});

interface INoSpoonWebSocket extends webSocket {
  isAlive: boolean | undefined;
}

WSS.on('connection', (ws: INoSpoonWebSocket , req: http.IncomingMessage) => {
  debug('received connection from %s', req.connection.remoteAddress);
  setEvents(ws, req);
});

const setEvents = (ws: INoSpoonWebSocket , req: http.IncomingMessage) => {
  ws.isAlive = true;

  ws.on('pong', () => {
    ws.isAlive = true;
    debug('received a pong from %s', req.connection.remoteAddress);

  });

  ws.on('message', handleMessage);

  ws.on('close', (message) => {
    debug('Disconnected %s', req.connection.remoteAddress);
    ws.isAlive = false;
  });
};

const handleMessage = (message: webSocket.Data) => {
  debug('received message %o', message);
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
