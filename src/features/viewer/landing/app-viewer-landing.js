import { LitElement, css, html } from 'lit';
import './viewer-stream-info.js';
import './viewer-join-live.js';
import './viewer-top-bar.js';

export class AppViewerLanding extends LitElement {
  static get styles() {
    return css`
      * {
        margin: 0;
        padding: 0;
        background-color: white;
        font-style: normal;
      }

      .landing-container {
        padding: 0 1rem;
        display: flex;
        flex-direction: column;
      }

      .notify-me-button {
        position: absolute;
        bottom: 2.5rem;
        width: 92%;
        padding: 0.563rem 1.063rem;
        border: none;
        background: #ffffff;
        border: 1px solid #d1d5db;
        box-shadow: 0px 0.063rem 0.125rem rgba(0, 0, 0, 0.05);
        border-radius: 0.375rem;
        font-weight: 500;
        font-size: 0.875rem;
        line-height: 1.25rem;
        color: #1f2937;
        cursor: pointer;
        align-self: center;
      }

      .notify-me-button.disable {
        opacity: 0.4;
        cursor: not-allowed;
      }
    `;
  }

  static get properties() {
    return {
      showErrorText: { type: Boolean },
      streamTitle: { type: String },
      streamDescription: { type: String },
      startTime: { type: String },
      streamId: { type: String },
      streamStatus: { type: String }
    };
  }

  constructor() {
    super();
    this.showErrorText = false;
    this.streamTitle = '';
    this.streamDescription = '';
    this.startTime = '';
    this.streamId = '';
    this.streamStatus = '';
  }

  render() {
    return html`
      <div class="landing-container">
        <viewer-top-bar
          startTime=${this.startTime}
          streamStatus=${this.streamStatus}
        ></viewer-top-bar>
        <viewer-stream-info
          streamTitle=${this.streamTitle}
          streamDescription=${this.streamDescription}
        ></viewer-stream-info>
        ${this.streamStatus === 'streamScheduled'
          ? html`
              <button type="button" disabled class="notify-me-button disable">
                Notify Me
              </button>
            `
          : html`
              <viewer-join-live
                streamId=${this.streamId}
                streamStatus=${this.streamStatus}
              ></viewer-join-live>
            `}
      </div>
    `;
  }
}

window.customElements.define('app-viewer-landing', AppViewerLanding);
