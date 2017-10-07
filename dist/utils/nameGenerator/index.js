"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const underscore_1 = require("underscore");
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
exports.randomNumber = (higherLimit = 100) => Math.floor(Math.random() * higherLimit) + 1;
const generator = () => `${underscore_1.sample(animals)}-${underscore_1.sample(adjectives)}-${exports.randomNumber()}`;
exports.default = generator;
//# sourceMappingURL=index.js.map