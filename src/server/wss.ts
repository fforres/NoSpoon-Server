import * as debug from 'debug';
const d = debug('websocket');

import * as webSocket from 'ws';

export type UserTypes = 'attacker' | 'defender';

export enum MessageTypes {
  createBullet = 'createBullet',
  identifyUser = 'identifyUser',
  bulletPosition = 'bulletPosition',
}

export interface INoSpoonMessage {
  room: string;
  id: string;
  type: MessageTypes;
  user: {
    id: string,
    type: UserTypes;
  };
}

export interface INoSpoonWebSocket extends webSocket {
  isAlive: boolean | undefined;
  attacker: boolean;
}

export class NoSpoonWebsocketServer extends webSocket.Server {
  public broadcast = (data: INoSpoonMessage) => {
    const message = JSON.stringify(data);
    d('Broadcasting to %s users', (this.clients.keys.length - 1) );
    d('MESSAGE: %o', message);
    this.clients.forEach((client: INoSpoonWebSocket) => {
      if (client.isAlive === false) {
        return client.terminate();
      }
      if (client.readyState && !client.attacker) {
        client.send(message);
      }
    });
  }
}
