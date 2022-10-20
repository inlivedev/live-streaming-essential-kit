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

  /**
   * @typedef MediaConfig
   * @property {string} videoSelector -
   * @property {object} [videoOptions] - Video option fetch parameter
   */

  /**
   * @type {MediaConfig}
   */
  const mediaConfig = {
    videoSelector: 'video',
    videoOptions: undefined
  };

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

  if (name === 'create') {
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
  } else if (name === 'prepare' || name === 'start' || name === 'end') {
    try {
      let dataStream;

      const functionName = name + 'Stream';

      const configObject = {
        stream_id: request.body.streamId
      };

      if (name === 'prepare') {
        configObject.media = request?.body?.media || mediaConfig;
      }

      if (configObject.stream_id !== undefined) {
        // trigger stream function
        dataStream = await InliveStream[functionName](inliveApp, configObject);
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
  }
};

export default handler;
