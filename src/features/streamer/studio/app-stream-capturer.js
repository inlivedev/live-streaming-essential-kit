import { LitElement } from 'lit';
import { InliveStream } from '@inlivedev/inlive-js-sdk/stream';
import { InliveEvent } from '@inlivedev/inlive-js-sdk/event';
import { fetchHttp } from '../../shared/modules/fetch-http.js';

/**
 * @typedef {import('./app-studio.js').StreamStatusType} StreamStatusType
 */

/**
 * @typedef ConnectionType
 * @property {Function} [close] - A method to close connection
 * @property {Function} [connect] - A method to connect the connection with remote peer
 * @property {Function} [getPeerConnection] - A method to check the current connection with peer
 */

export class AppStreamCapturer extends LitElement {
  static properties = {
    streamId: { type: Number },
    preparedAt: { type: String },
    videoElement: { type: Object },
    streamStatus: { type: String },
    connection: { state: true }
  };

  constructor() {
    super();
    /** @type {number | undefined} */
    this.streamId = undefined;
    /** @type {string | undefined} */
    this.preparedAt = undefined;
    /** @type {object | undefined} */
    this.videoElement = undefined;
    /** @type {StreamStatusType} */
    this.streamStatus = 'preparing';
    /** @type {ConnectionType} */
    this.connection;
  }

  connectedCallback() {
    super.connectedCallback();

    if (this.streamStatus !== 'end') {
      InliveEvent.subscribe('stream:ready-to-initialize-event', () => {
        this.handleStreamInitialization();
      });
    }
  }

  /**
   *
   * @param {import('lit').PropertyValues<any>} changedProperties - The component properties that change
   */
  firstUpdated(changedProperties) {
    if (changedProperties.has('videoElement') && this.streamStatus !== 'end') {
      this.initializeCapturer(this.videoElement);
    }
  }

  /**
   *
   * @param {import('lit').PropertyValues<any>} changedProperties - The component properties that change
   */
  updated(changedProperties) {
    if (changedProperties.has('streamStatus') && this.streamStatus === 'end') {
      this.connection.close && this.connection.close();
    }
  }

  /**
   *
   * @param {object | undefined} videoElement - The video element
   */
  async initializeCapturer(videoElement) {
    const defaultMediaConstraints = {
      video: {
        frameRate: 30,
        width: { min: 640, ideal: 1280, max: 1280 },
        height: { min: 360, ideal: 720, max: 720 }
      },
      audio: true
    };

    /** @type {MediaStream} */
    const mediaStream = await InliveStream.media.getUserMedia(
      defaultMediaConstraints
    );

    const mediaElement = InliveStream.media.attachMediaElement(
      videoElement,
      mediaStream
    );

    this.connection = await InliveStream.connection.open({
      streamId: this.streamId,
      mediaStream,
      mediaElement
    });

    if (!this.preparedAt) {
      this.handleStreamPreparation();
    } else {
      this.handleStreamInitialization();
    }
  }

  async handleStreamPreparation() {
    try {
      await fetchHttp({
        url: `/api/stream/prepare`,
        method: 'POST',
        body: {
          streamId: this.streamId
        }
      });
    } catch (error) {
      console.error(error);
    }
  }

  async handleStreamInitialization() {
    const peerConnection =
      this.connection.getPeerConnection && this.connection.getPeerConnection();

    try {
      const streamInitialization = await fetchHttp({
        url: `/api/stream/init`,
        method: 'POST',
        body: {
          streamId: this.streamId,
          sessionDescription: peerConnection.localDescription
        }
      });
      if (
        streamInitialization.status.code &&
        typeof streamInitialization.data === 'object'
      ) {
        const remoteSessionDescription = streamInitialization.data;
        this.connection.connect &&
          this.connection.connect(remoteSessionDescription);
      }
    } catch (error) {
      console.error('Error on stream initialization', error);
      alert('Failed to initialize a stream session');
    }
  }
}

customElements.define('app-stream-capturer', AppStreamCapturer);
