import * as debug from 'debug';
const d = debug('websocket');

import * as webSocket from 'ws';

export type UserTypes = 'attacker' | 'defender';

export enum MessageTypes {
  createBullet = 'createBullet',
  identifyUser = 'identifyUser',
  bulletPosition = 'bulletPosition',
  userPosition = 'userPosition',
}

export interface INoSpoonMessage {
  id: string;
  type: MessageTypes;
  user: {
    id: string,
    isDefender: boolean,
  };
}

export interface INoSpoonWebSocket extends webSocket {
  id: string;
  isAlive: boolean | undefined;
  attacker: boolean;
}

interface IWSSDataType {
  attackers: {
    [id: string]: INoSpoonWebSocket;
  };
  defenders: {
    [id: string]: INoSpoonWebSocket;
  };
}

export class NoSpoonWebsocketServer extends webSocket.Server {
  private data: IWSSDataType = {
    attackers: {},
    defenders: {},
  };

  public broadcast = (data: INoSpoonMessage) => {
    const message = JSON.stringify(data);
    // d('Broadcasting to %s users', (this.clients.keys.length) );
    // d('MESSAGE: %o', message);
    this.clients.forEach((client: INoSpoonWebSocket) => {
      if (data.user.id === client.id) {
        return;
      }
      if (client.isAlive === false) {
        return client.terminate();
      }
      if (client.readyState && !client.attacker) {
        client.send(message);
      }
    });
  }

  public removeAttacker = (id: string) => {
    if (this.data.attackers[id]) {
      delete this.data.attackers[id];
      d('REMOVED ATTACKER! %S', id);
    }
  }
  public addAttacker = (ws: INoSpoonWebSocket) => {
    this.data.attackers[ws.id] = ws;
    d('ADDED ATTACKER! %O', Object.keys(this.data.attackers));
  }

  public removeDefender = (id: string) => {
    if (this.data.defenders[id]) {
      delete this.data.defenders[id];
      d('REMOVED DEFENDER! %S', id);
    }
  }
  public addDefender = (ws: INoSpoonWebSocket) => {
    this.data.defenders[ws.id] = ws;
    d('ADDED DEFENDER! %O', Object.keys(this.data.defenders));
  }

  public sendToAttacker = (data: INoSpoonMessage) => {
    const message = JSON.stringify(data);
    d('Broadcasting to attacker');
    d('MESSAGE: %o', message);
    Object.keys(this.data.attackers).forEach((el: string) => {
      const attacker = this.data.attackers[el];
      if (!attacker.isAlive) {
        return attacker.terminate();
      }
      if (attacker.readyState && attacker.attacker) {
        attacker.send(message);
      }
    });
  }

  public sendToDefender = (data: INoSpoonMessage) => {
    const message = JSON.stringify(data);
    d('Broadcasting to attacker');
    d('MESSAGE: %o', message);
    Object.keys(this.data.defenders).forEach((el: string) => {
      const defender = this.data.defenders[el];
      if (!defender.isAlive) {
        return defender.terminate();
      }
      if (defender.readyState && !defender.attacker) {
        defender.send(message);
      }
    });
  }

}
