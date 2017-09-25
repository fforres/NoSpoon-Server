import * as debug from 'debug';
import * as webSocket from 'ws';
const d = debug('websocket');
const dh = debug('websocket:heartbeat');

const ws = new webSocket(`ws://localhost:${process.env.WS_PORT}`);
const message = (data: object) => JSON.stringify(data);

ws.on('open', () => {
  // Send Bullet
  ws.send(message({
    pos: {
      x: 2,
      y: 3,
      z: 4,
    },
    room: 'TEST_ID',
    rotation: {
      x: 12,
      y: 13,
      z: -14,
    },
    type: 'createBullet',
  }));
});

ws.on('message', (data: webSocket.Data) => {
  d('client: Received a message %o', data);
});

ws.on('ping', (data: webSocket.Data) => {
  dh('client: Received a ping %o', data);
});

// setTimeout(() => {
//   ws.terminate();
// }, 5000);
