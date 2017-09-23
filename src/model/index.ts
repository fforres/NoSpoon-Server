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
  debug('setting key: %s %O', name, value);
};

export const keepAlive = (name: string) => {
  client.get(name, (err, reply) => {
    debug('Getting key: %s', name);
    setKey(name, {...JSON.parse(reply)});
  });
};

export default client;
