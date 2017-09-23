"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
dotenv_1.config();
const model_1 = require("./model");
require("./server");
const ob = { value: 123, asd: 123 };
model_1.setHash('caballo-considerado-33', ob);
setInterval(() => {
    model_1.keepHashAlive('caballo-considerado-33');
}, 1000);
//# sourceMappingURL=index.js.map