import * as d from 'debug';
import { createClient } from 'redis';

const debug = d('redis');

const redisHost: any = process.env.REDIS_HOST;
const redisPort: any = process.env.REDIS_PORT;

const host = redisHost || 'localhost';
const port = redisPort || '6379';
const client = createClient(port, host);
const TTL = 5;

// Keys
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

// Hashes
export const setHash = async (name: string, value: object) => {
  return new Promise((resolve, reject) => {
    const newValue = {...value, TS: process.hrtime().join('.'), EX: TTL };
    client.HMSET(name, newValue, (err, res) => {
      if (err) {
        debug('Error Setting hash: %s to %O', name, newValue);
        return reject(err);
      }
      debug('Set hash: %s to %O', name, newValue);
      resolve(true);
    });
  });
};

const setHashKey = async (name: string, key: string, value: string) => {
  return new Promise((resolve, reject) => {
    client.HMSET(name, key, value, (err, res) => {
      if (err) {
        debug('ERROR setting hash key: %s to $s', name, value);
        return reject(err);
      }
      debug('Set hash key: %s to $s', name, value);
      resolve(res);
    });
  });
};

export const keepHashAlive = (name: string) => {
  client.hget(name, 'TS', (err, reply) => {
    debug('Getting key: %s', name, reply);
    setHashKey(name, 'TS', reply);
  });
};

export default client;
