"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const f = require("fastify");
const fastify = f();
const httpPort = parseInt(process.env.HTTP_PORT || '3000', 10);
fastify.get('/request-room', (request, reply) => {
    reply.send({ hello: 'sending-room' });
});
fastify.listen(httpPort, (err) => {
    if (err) {
        throw err;
    }
    console.log(`server listening on ${fastify.server.address().port}`);
});
//# sourceMappingURL=index.js.map