import { InliveApp } from '@inlivedev/inlive-js-sdk/app';
import { InliveStream } from '@inlivedev/inlive-js-sdk/stream';
import { validation } from '../auth/validation.js';

const handler = async (request, reply) => {
  /**
   * call a function to validate user
   */
  let validUser = await validation(request);

  if (!validUser)
    reply.code(403).send({
      success: false,
      code: 403,
      message: 'You are not authorized',
      data: undefined
    });

  const name = request?.params?.name;

  if (request.method !== 'POST') {
    reply.code(400).send({
      success: false,
      code: 400,
      message: 'Method is not allowed'
    });
  }

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

        if (dataStream.status.code === 200) {
          reply.code(200).send({
            success: true,
            code: dataStream.status.code,
            message: dataStream.status.message,
            data: dataStream.data
          });
        } else {
          reply.code(dataStream.status.code).send({
            success: false,
            code: dataStream.status.code,
            message: dataStream.status.message,
            data: dataStream.data
          });
        }
      } catch (error) {
        throw new Error(error);
      }

      break;
    }
    case 'start':
    case 'end': {
      try {
        let dataStream;

        const functionName = name + 'Stream';

        const configObject = {
          stream_id: request.body.streamId
        };

        if (configObject.stream_id !== undefined) {
          // trigger stream function
          dataStream = await InliveStream[functionName](
            inliveApp,
            configObject
          );
        }

        if (dataStream.status.code === 200) {
          reply.code(200).send({
            success: true,
            code: dataStream.status.code,
            message: dataStream.status.message,
            data: dataStream.data
          });
        } else {
          reply.code(dataStream.status.code).send({
            success: false,
            code: dataStream.status.code,
            message: dataStream.status.message,
            data: dataStream.data
          });
        }
      } catch (error) {
        throw new Error(error);
      }

      break;
    }
    case 'prepare': {
      try {
        let dataStream;

        const configObject = {
          streamId: request.body.streamId
        };

        if (configObject.streamId !== undefined) {
          // trigger stream function
          dataStream = await InliveStream.prepareStream(
            inliveApp,
            configObject
          );
        }

        if (dataStream.status.code === 200) {
          reply.code(200).send({
            success: true,
            code: dataStream.status.code,
            message: dataStream.status.message,
            data: dataStream.data
          });
        } else {
          reply.code(dataStream.status.code).send({
            success: false,
            code: dataStream.status.code,
            message: dataStream.status.message,
            data: dataStream.data
          });
        }
      } catch (error) {
        throw new Error(error);
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

        if (dataStream.status.code === 200) {
          reply.code(200).send({
            success: true,
            code: dataStream.status.code,
            message: dataStream.status.message,
            data: dataStream.data
          });
        } else {
          reply.code(dataStream.status.code).send({
            success: false,
            code: dataStream.status.code,
            message: dataStream.status.message,
            data: dataStream.data
          });
        }
      } catch (error) {
        throw new Error(error);
      }

      break;
    }
    // No default
  }
};

export default handler;
