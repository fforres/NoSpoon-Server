"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const debug = require("debug");
const d = debug('websocket');
const webSocket = require("ws");
var MessageTypes;
(function (MessageTypes) {
    MessageTypes["createBullet"] = "createBullet";
    MessageTypes["identifyUser"] = "identifyUser";
    MessageTypes["bulletPosition"] = "bulletPosition";
    MessageTypes["userPosition"] = "userPosition";
})(MessageTypes = exports.MessageTypes || (exports.MessageTypes = {}));
class NoSpoonWebsocketServer extends webSocket.Server {
    constructor() {
        super(...arguments);
        this.data = {
            attackers: {},
            defenders: {},
        };
        this.broadcast = (data) => {
            const message = JSON.stringify(data);
            d('MESSAGE: %o', message);
            this.clients.forEach((client) => {
                if (data.user.id === client.id) {
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
        this.removeAttacker = (id) => {
            if (this.data.attackers[id]) {
                delete this.data.attackers[id];
                d('REMOVED ATTACKER! %S', id);
            }
        };
        this.addAttacker = (ws) => {
            this.data.attackers[ws.id] = ws;
            d('ADDED ATTACKER! %O', Object.keys(this.data.attackers));
        };
        this.removeDefender = (id) => {
            if (this.data.defenders[id]) {
                delete this.data.defenders[id];
                d('REMOVED DEFENDER! %S', id);
            }
        };
        this.addDefender = (ws) => {
            this.data.defenders[ws.id] = ws;
            d('ADDED DEFENDER! %O', Object.keys(this.data.defenders));
        };
        this.sendToAttacker = (data) => {
            const message = JSON.stringify(data);
            d('Broadcasting to attacker');
            d('MESSAGE: %o', message);
            Object.keys(this.data.attackers).forEach((el) => {
                const attacker = this.data.attackers[el];
                if (!attacker.isAlive) {
                    return attacker.terminate();
                }
                if (attacker.readyState && attacker.attacker) {
                    attacker.send(message);
                }
            });
        };
        this.sendToDefender = (data) => {
            const message = JSON.stringify(data);
            d('Broadcasting to attacker');
            d('MESSAGE: %o', message);
            Object.keys(this.data.defenders).forEach((el) => {
                const defender = this.data.defenders[el];
                if (!defender.isAlive) {
                    return defender.terminate();
                }
                if (defender.readyState && !defender.attacker) {
                    defender.send(message);
                }
            });
        };
    }
}
exports.NoSpoonWebsocketServer = NoSpoonWebsocketServer;
//# sourceMappingURL=wss.js.map