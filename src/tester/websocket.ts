import * as debug from 'debug';
import * as webSocket from 'ws';
const d = debug('websocket');
const dh = debug('websocket:heartbeat');

const ws = new webSocket(`ws://localhost:${process.env.WS_PORT}`);
const ws2 = new webSocket(`ws://localhost:${process.env.WS_PORT}`);
const ws3 = new webSocket(`ws://localhost:${process.env.WS_PORT}`);

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
    type: 'identifyUser',
    user: {
      id: '1',
      type: 'attacker',
    },
  }));

  setTimeout(() => {
    ws.send(message({
      pos: {
        x: 2,
        y: 3,
        z: 4,
      },
      rotation: {
        x: 12,
        y: 13,
        z: -14,
      },
      type: 'bulletPosition',
      user: {
        id: '2',
        type: 'attacker',
      },
    }));
  }, 2000);
});

ws.on('message', (data: webSocket.Data) => {
  d('client: Received a message %o', data);
});

ws.on('ping', (data: webSocket.Data) => {
  dh('client: Received a ping %o', data);
});

ws2.on('open', () => {
  // Send Bullet
  ws.send(message({
    pos: {
      x: 2,
      y: 3,
      z: 4,
    },
    rotation: {
      x: 12,
      y: 13,
      z: -14,
    },
    type: 'identifyUser',
    user: {
      id: '2',
      type: 'attacker',
    },
  }));
});

ws2.on('message', (data: webSocket.Data) => {
  d('client: Received a message %o', data);
});

ws2.on('ping', (data: webSocket.Data) => {
  dh('client: Received a ping %o', data);
});

ws3.on('open', () => {
  // Send Bullet
  ws.send(message({
    pos: {
      x: 2,
      y: 3,
      z: 4,
    },
    rotation: {
      x: 12,
      y: 13,
      z: -14,
    },
    type: 'identifyUser',
    user: {
      id: '3',
      type: 'defender',
    },
  }));
});

ws3.on('message', (data: webSocket.Data) => {
  d('client: Received a message %o', data);
});

ws3.on('ping', (data: webSocket.Data) => {
  dh('client: Received a ping %o', data);
});
