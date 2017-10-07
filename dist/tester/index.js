"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const debug = require("debug");
if (process.env.__DEV__ === 'true') {
    debug.enable(process.env.DEBUG || '');
    require('./websocket');
}
//# sourceMappingURL=index.js.map