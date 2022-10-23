import { InliveApp } from '@inlivedev/inlive-js-sdk/app';
import { InliveStream } from '@inlivedev/inlive-js-sdk/stream';
import { validation } from '../../../features/auth/validation.js';

const handler = async (request, reply) => {
  const name = request?.params?.name;

  if (request.method.toUpperCase() !== 'POST') {
    reply.code(400).send({
      code: 400,
      message: 'Method is not allowed'
    });
  }
  /**
   * call a function to validate user
   */
  let validUser = await validation(request);

  if (!validUser)
    reply.code(403).send({
      code: 403,
      message: 'You are not authorized'
    });

  /**
   * @typedef Config
   * @property {string} api_key - A string of key that will be used to access inLive protected API
   */

  /**
   * A variable to create object
   *
   * @param {Config} config -- being passed from init module parameter
   */
  let config = {
    // eslint-disable-next-line camelcase
    api_key: process.env.API_KEY
  };

  const inliveApp = InliveApp.init(config);

  switch (name) {
    case 'create': {
      let dataStream;

      const configObject = {
        name: request?.body?.name || '',
        description: request?.body?.description
          ? request?.body?.description || ''
          : ''
      };

      dataStream = await InliveStream.createStream(inliveApp, configObject);
      reply.code(dataStream.status.code).send(dataStream);
      break;
    }
    case 'prepare':
    case 'start':
    case 'end': {
      let dataStream;

      const functionName = name + 'Stream';

      const configObject = {
        streamId: request.body.streamId
      };

      dataStream = await InliveStream[functionName](inliveApp, configObject);
      reply.code(dataStream.status.code).send(dataStream);
      break;
    }
    case 'init': {
      let dataStream;

      const configObject = {
        streamId: request.body.streamId,
        sessionDescription: request.body.sessionDescription
      };

      dataStream = await InliveStream.initStream(inliveApp, configObject);
      reply.code(dataStream.status.code).send(dataStream);
      break;
    }
    default: {
      break;
    }
  }
};

export default handler;
