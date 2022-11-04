import { html, css, LitElement } from 'lit';
import { InliveEvent } from '@inlivedev/inlive-js-sdk';
import './app-action-panel.js';
import './app-video-panel.js';
import './app-information-panel.js';
import './app-activity-panel.js';

/**
 * @typedef {'preparing' | 'connecting' | 'ready' | 'live' | 'end'} StreamStatusType
 */

export class AppStudio extends LitElement {
  static styles = css`
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    .main-panel {
      position: relative;
      min-height: 100vh;
      background-color: #000;
      color: #fff;
      display: grid;
      grid-template-areas:
        'information-panel'
        'action-panel'
        '.'
        'activity-panel';
      grid-template-rows: max-content max-content auto max-content;
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
    }

    .action-panel {
      margin-top: 1rem;
      position: relative;
      grid-area: action-panel;
    }

    .activity-panel {
      position: relative;
      grid-area: activity-panel;
    }

    .action-panel-container {
      padding-left: 1rem;
      padding-right: 1rem;
    }

    @media (min-width: 1024px) {
      .main-panel {
        background-color: #fff;
        color: #000;
        grid-template-areas:
          'video-panel action-panel'
          'video-panel activity-panel'
          'information-panel activity-panel';
        grid-template-columns: auto 20rem;
        grid-template-rows: 4.625rem max-content auto;
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

      .action-panel {
        margin-top: 0;
        z-index: 10;
      }

      .action-panel-container {
        position: fixed;
        top: 0;
        right: 0;
        width: 20rem;
        padding: 1rem;
        border-left: 1px solid #d1d5db;
      }

      .activity-panel-container {
        position: fixed;
        top: 4.625rem;
        right: 0;
        width: 20rem;
        height: calc(100% - 4.625rem);
        max-height: 100vh;
        border-left: 1px solid #d1d5db;
      }
    }

    @media (min-width: 1280px) {
      .main-panel {
        grid-template-columns: auto 23rem;
      }

      .action-panel-container,
      .activity-panel-container {
        width: 23rem;
      }
    }
  `;

  static properties = {
    heading: { type: String },
    description: { type: String },
    streamId: { type: Number },
    startTime: { type: String },
    endTime: { type: String },
    preparedAt: { type: String },
    quality: { type: Number },
    streamStatus: { type: String }
  };

  constructor() {
    super();
    /** @type {string} */
    this.heading = '';
    /** @type {string} */
    this.description = '';
    /** @type {number | undefined} */
    this.streamId = undefined;
    /** @type {string} */
    this.startTime = '';
    /** @type {string} */
    this.endTime = '';
    /** @type {string} */
    this.preparedAt = '';
    /** @type {number | undefined} */
    this.quality = undefined;
    /** @type {StreamStatusType} */
    this.streamStatus = 'preparing';
  }

  connectedCallback() {
    super.connectedCallback();

    if (this.startTime && this.endTime) {
      this.streamStatus = 'end';
    } else {
      InliveEvent.subscribe('stream:ready-to-start-event', () => {
        this.streamStatus = 'ready';
      });

      InliveEvent.subscribe('stream:start-event', () => {
        this.streamStatus = 'live';
      });

      InliveEvent.subscribe('stream:end-event', () => {
        this.streamStatus = 'end';
      });
    }
  }

  render() {
    return html`
      <div class="main-panel">
        <div class="video-panel">
          <app-video-panel
            streamId=${this.streamId}
            startTime=${this.startTime}
            endTime=${this.endTime}
            preparedAt=${this.preparedAt}
            streamStatus=${this.streamStatus}
          ></app-video-panel>
        </div>
        <div class="information-panel">
          <app-information-panel
            heading=${this.heading}
            description=${this.description}
            streamStatus=${this.streamStatus}
            startTime=${this.startTime}
            endTime=${this.endTime}
          ></app-information-panel>
        </div>
        <div class="action-panel">
          <div class="action-panel-container">
            <app-action-panel
              streamId=${this.streamId}
              streamStatus=${this.streamStatus}
            ></app-action-panel>
          </div>
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

customElements.define('app-studio', AppStudio);
