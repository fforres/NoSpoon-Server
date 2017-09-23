import { config } from 'dotenv';
config();
import { keepHashAlive, setHash } from './model';
import './server';

const ob = { value: 123, asd: 123 };
setHash('caballo-considerado-33', ob);
setInterval(() => {
  keepHashAlive('caballo-considerado-33');
}, 1000);
