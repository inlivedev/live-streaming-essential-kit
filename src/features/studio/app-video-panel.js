import { html, LitElement, css } from 'lit';
import './app-stream-capturer.js';

/**
 * @typedef {import('./app-studio.js').StreamStatusType} StreamStatusType
 */

/**
 * @typedef {import('./app-stream-capturer.js').AppStreamCapturer} AppStreamCapturer
 */

export class AppVideoPanel extends LitElement {
  static styles = css`
    :host {
      display: flex;
      align-items: center;
      width: 100%;
      height: 100%;
    }

    .container {
      flex: 1;
      background-color: #121212;
    }

    @media (min-width: 1024px) {
      .container {
        overflow: hidden;
        border-radius: 1rem;
      }
    }

    .video-placeholder {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      font-size: 1rem;
      line-height: 1.5rem;
      padding: 1rem;
      box-sizing: border-box;
      z-index: 10;
    }

    .video-ratio {
      position: relative;
      width: 100%;
      height: auto;
      padding-top: calc(9 / 16 * 100%); /* 16:9 ratio */
    }

    .video-element {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      object-fit: cover;
    }
  `;

  static properties = {
    endTime: { type: String },
    startTime: { type: String },
    streamId: { type: Number },
    preparedAt: { type: String },
    streamStatus: { type: String }
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
    /** @type {StreamStatusType} */
    this.streamStatus = 'preparing';
  }

  firstUpdated() {
    if (this.streamStatus !== 'end') {
      this.attachVideoElement();
    }
  }

  attachVideoElement() {
    const videoElement = this.videoElement;
    const streamCapturer = this.streamCapturer;

    if (videoElement && streamCapturer) {
      streamCapturer.videoElement = videoElement;
    }
  }

  get streamCapturer() {
    return /** @type {AppStreamCapturer} */ (
      this.renderRoot.querySelector('app-stream-capturer')
    );
  }

  get videoElement() {
    return /** @type {HTMLVideoElement} */ (
      this.renderRoot.querySelector('.video-element')
    );
  }

  render() {
    return html`
      <app-stream-capturer
        streamId=${this.streamId}
        preparedAt=${this.preparedAt}
        streamStatus=${this.streamStatus}
      ></app-stream-capturer>
      <div class="container">
        <div class="video-ratio">
          ${this.streamStatus === 'preparing'
            ? html`
                <div class="video-placeholder">
                  We're preparing the live stream for you. Please wait until the
                  live stream is ready.
                </div>
              `
            : this.streamStatus === 'end'
            ? html`
                <div class="video-placeholder">The live stream has ended.</div>
              `
            : undefined}
          <video class="video-element"></video>
        </div>
      </div>
    `;
  }
}

customElements.define('app-video-panel', AppVideoPanel);
