import { sample } from 'underscore';

const adjectives = [
  'adaptable',
  'aventurero',
  'cariñoso',
  'ambicioso',
  'amable',
  'compasivo',
  'considerado',
  'valiente',
  'cortes',
  'diligente',
  'empatico',
  'exuberante',
  'franco',
  'generoso',
  'gregario',
  'imparcial',
  'intuitivo',
  'inteligente',
  'apasionado',
  'persistente',
  'filosofico',
  'practico',
  'racional',
  'confiable',
  'sensato',
  'sincero',
  'simpatico',
  'modesto',
  'ingenioso',
];

const animals = [
  'mapache',
  'huemul',
  'condor',
  'condor',
  'cabrito',
  'zorrillo',
  'pato',
  'pollo',
  'perezoso',
  'canguro',
  'toro',
  'erizo',
  'pingüino',
  'koala',
  'panda',
  'gato',
  'perro',
  'poni',
  'caballo',
  'gorila',
  'castor',
  'wombat',
  'ciervo',
  'conejo',
  'ornitorrinco',
  'oso',
  'elefante',
];

export const randomNumber = (higherLimit: number = 100) => Math.floor(Math.random() * higherLimit) + 1;
const generator = (): string => `${sample(animals)}-${sample(adjectives)}-${randomNumber()}`;

export default generator;
