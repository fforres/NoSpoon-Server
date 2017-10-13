"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const debug = require("debug");
const d = debug('websocket');
const webSocket = require("ws");
var MessageTypes;
(function (MessageTypes) {
    MessageTypes["userWon"] = "userWon";
    MessageTypes["userMadeAPoint"] = "userMadeAPoint";
    MessageTypes["createBullet"] = "createBullet";
    MessageTypes["identifyUser"] = "identifyUser";
    MessageTypes["bulletPosition"] = "bulletPosition";
    MessageTypes["userPosition"] = "userPosition";
})(MessageTypes = exports.MessageTypes || (exports.MessageTypes = {}));
class NoSpoonWebsocketServer extends webSocket.Server {
    constructor() {
        super(...arguments);
        this.data = {
            gameState: {
                users: {},
                winner: null,
            },
        };
        this.broadcastEveryone = (data) => {
            const message = JSON.stringify(data);
            this.clients.forEach((client) => {
                if (client.isAlive === false) {
                    return client.terminate();
                }
                if (client.readyState) {
                    client.send(message);
                }
            });
        };
        this.broadcast = (action) => {
            if (!action.user) {
                return;
            }
            const userID = action.user.id;
            const message = JSON.stringify(action);
            this.clients.forEach((client) => {
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
        };
        this.createUser = (action, ws) => {
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
                d('Creating a user %o %o', action, this.data.gameState.users);
                ws.send(JSON.stringify(action));
            }
        };
        this.userMadeAPoint = (action, ws) => {
            if (action.user) {
                const userID = action.user.id;
                this.data.gameState.users[userID].points += 1;
                if (this.data.gameState.users[userID].points === 4 && !this.data.gameState.winner) {
                    this.data.gameState.winner = userID;
                }
            }
            d('GAME STATE %o', this.data.gameState);
        };
        this.userChangedPosition = (action, position, rotation) => {
            if (!position || !rotation || !action.user) {
                return;
            }
            const userID = action.user.id;
            this.data.gameState.users[userID].position = position;
            this.data.gameState.users[userID].rotation = rotation;
            const customAction = {
                id: action.id,
                points: this.data.gameState.users[userID].points,
                position: this.data.gameState.users[userID].position,
                rotation: this.data.gameState.users[userID].rotation,
                type: MessageTypes.userPosition,
                user: action.user,
            };
            this.broadcast(customAction);
        };
        this.runWinLoop = (ws) => {
            if (this.data.gameState.winner) {
                const customAction = {
                    id: ws.id,
                    type: MessageTypes.userWon,
                };
                this.broadcastEveryone(customAction);
            }
        };
    }
}
exports.NoSpoonWebsocketServer = NoSpoonWebsocketServer;
//# sourceMappingURL=wss.js.map