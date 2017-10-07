"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const debug = require("debug");
const express = require("express");
const http = require("http");
const wss_1 = require("./wss");
const d = debug('websocket');
const dh = debug('websocket:heartbeat');
const port = parseInt(process.env.PORT || '3001', 10);
const app = express();
const server = http.createServer(app);
server.listen(port);
const WSS = new wss_1.NoSpoonWebsocketServer({ server });
console.log('SERVER HTTP + WS CREATED ON PORT ', port);
WSS.on('connection', (ws, req) => setEvents(ws, req));
const setEvents = (ws, req) => {
    ws.isAlive = true;
    ws.on('pong', () => {
        dh('received a pong from %s', req.connection.remoteAddress);
        ws.isAlive = true;
    });
    ws.on('message', (message) => handleMessage(message, ws));
    ws.on('close', (message) => {
        d('Disconnected %s', req.connection.remoteAddress);
        ws.isAlive = false;
        if (ws.attacker) {
            WSS.removeAttacker(ws.id);
        }
        else {
            WSS.removeDefender(ws.id);
        }
    });
};
const handleMessage = (message, ws) => {
    if (typeof message === 'string') {
        try {
            const action = JSON.parse(message);
            if (!ws.id && action.user.id) {
                d('%O', action);
                ws.id = action.user.id;
                if (action.user.isDefender) {
                    ws.attacker = false;
                    WSS.addDefender(ws);
                }
                else {
                    ws.attacker = true;
                    WSS.addAttacker(ws);
                }
                ws.send(message);
            }
            if (action.type === wss_1.MessageTypes.createBullet) {
                d('Creating bullet! %O', action);
                WSS.sendToDefender(action);
            }
            if (action.type === wss_1.MessageTypes.userPosition) {
                WSS.broadcast(action);
            }
            if (action.type === wss_1.MessageTypes.bulletPosition) {
                WSS.broadcast(action);
            }
        }
        catch (e) {
            d('ERROR!!!: %s', e);
        }
    }
};
setInterval(() => {
    WSS.clients.forEach((ws) => {
        if (ws.isAlive === false) {
            return ws.terminate();
        }
        ws.ping('', false, true);
    });
}, 1000);
//# sourceMappingURL=websocket.js.map