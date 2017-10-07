"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
exports.getUniqueId = () => `${uuid_1.v4()}_${process.hrtime().join('.')}`;
//# sourceMappingURL=index.js.map