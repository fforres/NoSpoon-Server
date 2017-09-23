"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const d = require("debug");
const redis_1 = require("redis");
const debug = d('redis');
const redisHost = process.env.REDIS_HOST;
const redisPort = process.env.REDIS_PORT;
const host = redisHost || 'localhost';
const port = redisPort || '6379';
const client = redis_1.createClient(port, host);
const TTL = 5;
exports.setKey = (name, value) => {
    const newValue = Object.assign({}, value, { TS: process.hrtime().join('.') });
    client.set(name, JSON.stringify(newValue), 'EX', TTL);
    debug('setting key: %s %O', name, newValue);
};
exports.keepKeyAlive = (name) => {
    client.get(name, (err, reply) => {
        debug('Getting key: %s', name);
        exports.setKey(name, Object.assign({}, JSON.parse(reply)));
    });
};
exports.setHash = (name, value) => {
    const newValue = Object.assign({}, value, { TS: process.hrtime().join('.'), EX: TTL });
    client.HMSET(name, newValue);
    debug('setting hash: %s %O', name, newValue);
};
const setHashKey = (name, key, value) => {
    client.HMSET(name, key, value);
    debug('setting hash: %s - key: %s, value: %s', name, key, value);
};
exports.keepHashAlive = (name) => {
    client.hget(name, 'TS', (err, reply) => {
        debug('Getting key: %s', name, reply);
        setHashKey(name, 'TS', reply);
    });
};
exports.default = client;
//# sourceMappingURL=index.js.map