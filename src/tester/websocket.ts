import * as d from 'debug';
import * as webSocket from 'ws';
const debug = d('tester:websocket');

const ws = new webSocket(`ws://localhost:${process.env.WS_PORT}`);

ws.on('open', () => {
  ws.send('something');
});

ws.on('message', (data: webSocket.Data) => {
  debug('client: Received a message %o', data);
});

ws.on('ping', (data: webSocket.Data) => {
  debug('client: Received a ping %o', data);
});

// setTimeout(() => {
//   ws.terminate();
// }, 5000);
