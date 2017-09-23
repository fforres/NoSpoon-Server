import * as f from 'fastify';
const fastify = f();

const httpPort: number = parseInt(process.env.HTTP_PORT || '3000', 10);

fastify.get('/request-room', (request, reply) => {
  reply.send({ hello: 'sending-room' });
});

fastify.listen(httpPort, (err) => {
  if (err) { throw err; }
  // tslint:disable-next-line no-console
  console.log(`server listening on ${fastify.server.address().port}`);
});
