import * as debug from 'debug';
const d = debug('websocket');

import * as webSocket from 'ws';

export type UserTypes = 'attacker' | 'defender';

export enum MessageTypes {
  userDisconnected = 'userDisconnected',
  userWon = 'userWon',
  userMadeAPoint = 'userMadeAPoint',
  createBullet = 'createBullet',
  identifyUser = 'identifyUser',
  bulletPosition = 'bulletPosition',
  userPosition = 'userPosition',
  ping = 'ping',
}

export interface INoSpoonMessage {
  id: string;
  type: MessageTypes;
  user?: {
    id: string,
    userName: string,
    isDefender: boolean,
  };
  position?: IPosition;
  points?: number;
  rotation?: IRotation;
}

export interface INoSpoonWebSocket extends webSocket {
  id: string;
  isAlive: boolean | undefined;
  attacker: boolean;
}

export interface IPosition {
  x: number;
  y: number;
  z: number;
}
export interface IRotation {
  x: number;
  y: number;
  z: number;
}

interface IWSSDataType {
  gameState: {
    users: {
      [id: string]: {
        position: IPosition,
        rotation: IRotation,
        points: number,
        userName: string,
      };
    };
    winner: string | null;
  };
}

export class NoSpoonWebsocketServer extends webSocket.Server {
  private data: IWSSDataType = {
    gameState: {
      users: {},
      winner: null,
    },
  };

  public broadcastEveryone = (data: INoSpoonMessage) => {
    const message = JSON.stringify(data);
    this.clients.forEach((client: INoSpoonWebSocket) => {
      if (client.isAlive === false) {
        return client.terminate();
      }
      if (client.readyState) {
        client.send(message);
      }
    });
  }

  public broadcast = (action: INoSpoonMessage) => {
    if (!action.user) {
      return;
    }
    const userID = action.user.id;
    const message = JSON.stringify(action);
    this.clients.forEach((client: INoSpoonWebSocket) => {
      if (userID === client.id) {
        return;
      }
      if (client.isAlive === false) {
        return client.terminate();
      }
      if (client.readyState) {
        client.send(message);
      }
    });
  }

  public createUser = (action: INoSpoonMessage, ws: INoSpoonWebSocket) => {
    if (!action.user) {
      return;
    }
    const userID = action.user.id;
    if (!this.data.gameState.users[userID]) {
      ws.id = userID;
      this.data.gameState.users[userID] = {
        points: 0,
        position: {
          x: 0,
          y: 0,
          z: 0,
        },
        rotation: {
          x: 0,
          y: 0,
          z: 0,
        },
        userName: action.user.userName,
      };
      // d('Creating a user %o %o', action, this.data.gameState.users);
      ws.send(JSON.stringify(action));
    }
  }

  public userMadeAPoint = (action: INoSpoonMessage, ws: INoSpoonWebSocket) => {
    if (action.user) {
      const userID = action.user.id;
      this.data.gameState.users[userID].points += 1;
      if (this.data.gameState.users[userID].points === 4 && !this.data.gameState.winner) {
        this.data.gameState.winner = userID;
      }
    }
    d('GAME STATE %o', this.data.gameState.winner);
  }

  public userChangedPosition = (action: INoSpoonMessage, position?: IPosition, rotation?: IPosition) => {
    if (!position || !rotation || !action.user) {
      return;
    }
    const userID = action.user.id;
    this.data.gameState.users[userID].position = position;
    this.data.gameState.users[userID].rotation = rotation;

    const customAction: INoSpoonMessage = {
      id: action.id,
      points: this.data.gameState.users[userID].points,
      position: this.data.gameState.users[userID].position,
      rotation: this.data.gameState.users[userID].rotation,
      type: MessageTypes.userPosition,
      user: action.user,
    };
    this.broadcast(customAction);
  }

  public runWinLoop = (ws: INoSpoonWebSocket) => {
    if (this.data.gameState.winner) {
      const customAction: INoSpoonMessage = {
        id: ws.id,
        type: MessageTypes.userWon,
      };
      this.broadcastEveryone(customAction);
    }
  }

}
