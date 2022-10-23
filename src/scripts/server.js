import path from 'path';
import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import fastifyCookie from '@fastify/cookie';
import fastifyJwt from '@fastify/jwt';
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
  fastify.register(fastifyJwt, {
    secret: process.env.JWT_SECRET,
    sign: {
      expiresIn: process.env.JWT_EXPIRES_IN
    },
    cookie: {
      cookieName: 'token'
    }
  });

  fastify
    .listen({ port: PORT, host: '0.0.0.0' })
    .then((address) => console.log(`server listening on ${address}`))
    .catch((error) => {
      console.log('Error starting server:', error);
      throw new Error(`Error starting server: ${error}`);
    });
};

createServer();
