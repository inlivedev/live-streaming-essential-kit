import { LitElement } from 'lit';
import { InliveStream } from '@inlivedev/inlive-js-sdk/stream';
import { InliveEvent } from '@inlivedev/inlive-js-sdk/event';
import { fetchHttp } from '../shared/modules/fetch-http.js';

export class AppStreamCapturer extends LitElement {
  static properties = {
    endTime: { type: String },
    startTime: { type: String },
    streamId: { type: Number },
    preparedAt: { type: String },
    videoElement: { type: Object }
  };

  constructor() {
    super();
    /** @type {string | undefined} */
    this.endTime = undefined;
    /** @type {string | undefined} */
    this.startTime = undefined;
    /** @type {number | undefined} */
    this.streamId = undefined;
    /** @type {string | undefined} */
    this.preparedAt = undefined;
    /** @type {object | undefined} */
    this.videoElement = undefined;
  }

  /**
   *
   * @param {import('lit').PropertyValues<any>} changedProperties - The component properties that change
   */
  firstUpdated(changedProperties) {
    if (changedProperties.has('videoElement') && !this.endTime) {
      this.initializeCapturer(this.videoElement);
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

    const connection = await InliveStream.connection.open({
      streamId: this.streamId,
      mediaStream,
      mediaElement
    });

    const peerConnection = connection.getPeerConnection();

    InliveEvent.subscribe('stream:end-event', () => {
      connection.close();
    });

    if (!this.preparedAt) {
      try {
        await fetchHttp({
          url: `/api/stream/prepare`,
          method: 'POST',
          body: {
            streamId: this.streamId
          }
        });
      } catch (error) {
        console.error('Error on stream preparation', error);
        alert('Failed to prepare a stream session');
      }
    } else {
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
          connection.connect(remoteSessionDescription);
        }
      } catch (error) {
        console.error('Error on stream initialization', error);
        alert('Failed to initialize a stream session');
      }
    }
  }
}

customElements.define('app-stream-capturer', AppStreamCapturer);
