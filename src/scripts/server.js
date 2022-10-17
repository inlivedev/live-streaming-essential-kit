import path from 'path';
import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import fastifyCookie from '@fastify/cookie';
import { ssrEntryServer } from '../ssr/server/entry-server.js';
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 3000;
const root = process.cwd();

const createServer = async () => {
  const fastify = Fastify({
    ignoreTrailingSlash: true
  });

  await fastify.register(fastifyStatic, {
    root: path.resolve(root, `build/__static`),
    prefix: '/static',
    decorateReply: false
  });

  await fastify.register(fastifyStatic, {
    root: path.resolve(root, `build/__client`),
    prefix: '/__client',
    decorateReply: false
  });

  await fastify.register(ssrEntryServer);
  fastify.register(fastifyCookie);

  fastify
    .listen({ port: PORT, host: '0.0.0.0' })
    .then((address) => console.log(`server listening on ${address}`))
    .catch((err) => {
      console.log('Error starting server:', err);
      process.exit(1);
    });
};

createServer();
