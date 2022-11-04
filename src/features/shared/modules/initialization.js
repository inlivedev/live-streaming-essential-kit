import { InliveApp } from '@inlivedev/inlive-js-sdk';

export const initialization = () => {
  /**
   * @typedef Config
   * @property {string} apiKey - A string of key that will be used to access inLive protected API
   */

  /**
   * A variable to create object
   *
   * @param {Config} config - The initialization configuration
   */
  let config = {
    apiKey: process.env.API_KEY
  };

  return InliveApp.init(config);
};
