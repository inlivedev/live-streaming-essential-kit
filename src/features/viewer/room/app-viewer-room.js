import { css, html, LitElement } from 'lit';
import './app-video-panel.js';
import './app-information-panel.js';
import './app-activity-panel.js';

/**
 * @typedef {'upcoming' | 'live' | 'end'} StreamStatusType
 */

export class AppViewerRoom extends LitElement {
  static styles = css`
    .main-panel {
      position: relative;
      min-height: 100vh;
      background-color: #000;
      color: #fff;
      display: grid;
      grid-template-areas:
        'information-panel'
        '.'
        'activity-panel';
      grid-template-rows: max-content auto max-content;
      grid-template-columns: 1fr;
    }

    .video-panel {
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      grid-area: video-panel;
    }

    .information-panel {
      position: relative;
      margin-top: 3rem;
      grid-area: information-panel;
      overflow-x: hidden;
    }

    .activity-panel {
      position: relative;
      grid-area: activity-panel;
    }

    @media (min-width: 1024px) {
      .main-panel {
        background-color: #fff;
        color: #000;
        grid-template-areas:
          'video-panel activity-panel'
          'information-panel activity-panel';
        grid-template-columns: auto 20rem;
        grid-template-rows: max-content auto;
      }

      .video-panel {
        position: unset;
        top: unset;
        left: unset;
        width: auto;
        height: auto;
        padding: 1.5rem 1.5rem 0 1.5rem;
      }

      .information-panel {
        margin-top: 0;
      }

      .activity-panel-container {
        position: fixed;
        top: 0;
        right: 0;
        width: 20rem;
        height: 100%;
        max-height: 100vh;
        border-left: 1px solid #d1d5db;
      }
    }

    @media (min-width: 1280px) {
      .main-panel {
        grid-template-columns: auto 23rem;
      }

      .activity-panel-container {
        width: 23rem;
      }
    }
  `;

  static properties = {
    heading: { type: String },
    description: { type: String },
    hlsManifest: { type: String },
    dashManifest: { type: String },
    startTime: { type: String },
    endTime: { type: String }
  };

  constructor() {
    super();
    /** @type {string} */
    this.heading = '';
    /** @type {string} */
    this.description = '';
    /** @type {string} */
    this.hlsManifest = '';
    /** @type {string} */
    this.dashManifest = '';
    /** @type {string} */
    this.startTime = '';
    /** @type {string} */
    this.endTime = '';
    /** @type {StreamStatusType} */
    this.streamStatus = 'upcoming';
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.startTime && !this.endTime) {
      this.streamStatus = 'live';
    } else if (this.startTime && this.endTime) {
      this.streamStatus = 'end';
    }
  }

  render() {
    return html`
      <div class="main-panel">
        <div class="video-panel">
          <app-video-panel
            hlsManifest=${this.hlsManifest}
            dashManifest=${this.dashManifest}
          ></app-video-panel>
        </div>
        <div class="information-panel">
          <app-information-panel
            heading=${this.heading}
            description=${this.description}
            streamStatus=${this.streamStatus}
          ></app-information-panel>
        </div>
        <div class="activity-panel">
          <div class="activity-panel-container">
            <app-activity-panel></app-activity-panel>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('app-viewer-room', AppViewerRoom);
