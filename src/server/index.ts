import * as d from 'debug';
import * as f from 'fastify';
const fastify = f();
import { createRoom } from '../models/rooms';
const debug = d('server');
const httpPort: number = parseInt(process.env.HTTP_PORT || '3000', 10);

fastify.get('/request-room', async (request, reply) => {
  const roomId = await createRoom();
  if (roomId && typeof roomId === 'string') {
    debug('room id %s created successfully', roomId);
    return reply.send({ roomId });
  }
  debug('error creating a room id %s');
  reply.send({
    error: true,
    errorMsg: 'error creating your roomId',
  });
});

fastify.listen(httpPort, (err) => {
  if (err) {
    throw err;
  }
  // tslint:disable-next-line no-console
  console.log(`server listening on ${fastify.server.address().port}`);
});
