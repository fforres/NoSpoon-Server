import * as d from 'debug';
import { createClient } from 'redis';

const debug = d('redis');

const redisHost: any = process.env.REDIS_HOST;
const redisPort: any = process.env.REDIS_PORT;

const host = redisHost || 'localhost';
const port = redisPort || '6379';
const client = createClient(port, host);

const TTL = 5;

export const setKey = (name: string, value: object) => {
  const newValue = {...value, TS: process.hrtime().join('.') };
  client.set(name, JSON.stringify(newValue), 'EX', TTL);
  debug('setting key: %s %O', name, newValue);
};

export const keepKeyAlive = (name: string) => {
  client.get(name, (err, reply) => {
    debug('Getting key: %s', name);
    setKey(name, {...JSON.parse(reply)});
  });
};

export const setHash = (name: string, value: object) => {
  const newValue = {...value, TS: process.hrtime().join('.'), EX: TTL };
  client.HMSET(name, newValue);
  debug('setting hash: %s %O', name, newValue);
};

const setHashKey = (name: string, key: string, value: string) => {
  client.HMSET(name, key, value);
  debug('setting hash: %s - key: %s, value: %s', name, key, value);
};

export const keepHashAlive = (name: string) => {
  client.hget(name, 'TS', (err, reply) => {
    debug('Getting key: %s', name, reply);
    setHashKey(name, 'TS', reply);
  });
};

export default client;
