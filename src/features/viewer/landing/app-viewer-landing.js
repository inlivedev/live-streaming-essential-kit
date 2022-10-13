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
        font-family: 'Inter';
        font-style: normal;
      }

      .landing-container {
        padding: 0 1rem;
        display: flex;
        flex-direction: column;
      }

      @media (min-width: 640px) {
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
      isScheduled: { type: String },
      isEnded: { type: String },
      isLive: { type: String }
    };
  }

  constructor() {
    super();
    this.showErrorText = false;
    this.streamTitle = '';
    this.streamDescription = '';
    this.startTime = '';
    this.streamId = '';
    this.isScheduled = '';
    this.isEnded = '';
    this.isLive = '';
  }

  render() {
    return html`
      <div class="landing-container">
        <viewer-top-bar
          startTime=${this.startTime}
          isScheduled=${this.isScheduled}
          isEnded=${this.isEnded}
          isLive=${this.isLive}
        ></viewer-top-bar>
        <viewer-stream-info
          streamTitle=${this.streamTitle}
          streamDescription=${this.streamDescription}
        ></viewer-stream-info>
        ${this.isLive === 'true'
          ? html`<viewer-join-live
              streamId=${this.streamId}
            ></viewer-join-live>`
          : null}
      </div>
    `;
  }
}

window.customElements.define('app-viewer-landing', AppViewerLanding);
