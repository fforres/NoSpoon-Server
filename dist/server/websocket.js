"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const debug = require("debug");
const express = require("express");
const http = require("http");
const wss_1 = require("./wss");
const d = debug('websocket');
const port = parseInt(process.env.PORT || '3001', 10);
const app = express();
const server = http.createServer(app);
server.listen(port);
const WSS = new wss_1.NoSpoonWebsocketServer({ server, perMessageDeflate: true });
WSS.on('connection', (ws, req) => setEvents(ws, req));
d('SERVER HTTP + WS CREATED ON PORT %s', port);
const setEvents = (ws, req) => {
    ws.isAlive = true;
    ws.on('pong', () => {
        ws.isAlive = true;
    });
    ws.on('message', (message) => handleMessage(message, ws));
    ws.on('close', (message) => {
        ws.isAlive = false;
        if (typeof message === 'string') {
            const action = JSON.parse(message);
            d('Disconnected %O', action);
            const customAction = {
                id: action.id,
                type: wss_1.MessageTypes.userDisconnected,
                user: action.user,
            };
            WSS.broadcastEveryone(customAction);
        }
    });
};
const handleMessage = (message, ws) => {
    if (typeof message === 'string') {
        try {
            const action = JSON.parse(message);
            WSS.createUser(action, ws);
            if (action.type === wss_1.MessageTypes.userMadeAPoint) {
                WSS.userMadeAPoint(action, ws);
                WSS.runWinLoop(ws);
            }
            if (action.type === wss_1.MessageTypes.createBullet) {
                WSS.broadcast(action);
            }
            if (action.type === wss_1.MessageTypes.userPosition) {
                WSS.userChangedPosition(action, action.position, action.rotation);
            }
            if (action.type === wss_1.MessageTypes.bulletPosition) {
                WSS.broadcast(action);
            }
        }
        catch (e) {
            d('========= ERROR!!! =========== \n %O', e);
        }
    }
};
setInterval(() => {
    WSS.clients.forEach((ws) => {
        if (ws.isAlive === false) {
            return ws.terminate();
        }
        ws.isAlive = false;
        ws.ping('', false, true);
    });
}, 1000);
//# sourceMappingURL=websocket.js.map