import { config } from 'dotenv';
import { keepAlive, setKey } from './model';
import generateName, { randomNumber } from './nameGenerator';

config();

const ob = { value: 123, asd: 123 };
setKey('caballo-considerado-33', ob);
setInterval(() => {
  keepAlive('caballo-considerado-33');
}, 1000);
