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

  /**
   * Initialize an initialization instance
   *
   * @function
   * @param {Config} config - A set of key/value parameter configuration
   * @returns {object} InitializationInstance that contains config object of api_key
   */
  const inliveApp = InliveApp.init(config);

  switch (name) {
    case 'create': {
      try {
        let dataStream;

        const configObject = {
          name: request?.body?.name || '',
          description: request?.body?.description
            ? request?.body?.description || ''
            : ''
        };

        if (configObject.name !== undefined && configObject.name !== null) {
          // trigger create function
          dataStream = await InliveStream.createStream(inliveApp, configObject);
        }

        reply.code(dataStream.status.code).send(dataStream);
      } catch (error) {
        if (error instanceof SyntaxError) {
          throw error;
        }
      }

      break;
    }
    case 'prepare':
    case 'start':
    case 'end': {
      try {
        let dataStream;

        const functionName = name + 'Stream';

        const configObject = {
          streamId: request.body.streamId
        };

        if (configObject.streamId !== undefined) {
          // trigger stream function
          dataStream = await InliveStream[functionName](
            inliveApp,
            configObject
          );
        }

        reply.code(dataStream.status.code).send(dataStream);
      } catch (error) {
        if (error instanceof SyntaxError) {
          throw error;
        }
      }

      break;
    }
    case 'init': {
      try {
        let dataStream;

        const configObject = {
          streamId: request.body.streamId,
          sessionDescription: request.body.sessionDescription
        };

        if (
          configObject.streamId !== undefined &&
          configObject.sessionDescription !== undefined
        ) {
          // trigger stream function
          dataStream = await InliveStream.initStream(inliveApp, configObject);
        }

        reply.code(dataStream.status.code).send(dataStream);
      } catch (error) {
        if (error instanceof SyntaxError) {
          throw error;
        }
      }

      break;
    }
    default: {
      break;
    }
  }
};

export default handler;
