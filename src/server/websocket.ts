import * as d from 'debug';
import { Server } from 'ws';

const debug = d('websocket');

const WSS = new Server({
  port: parseInt(process.env.WS_PORT || '3001', 1000),
});

WSS.on('connection', (ws, req) => {
  console.log(req.connection.remoteAddress);
  ws.on('message', (message) => {
    debug('received message %o', message);
  });
});