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
        ${this.streamStatus === 'streamLive'
          ? html`<viewer-join-live
              streamId=${this.streamId}
            ></viewer-join-live>`
          : null}
      </div>
    `;
  }
}

window.customElements.define('app-viewer-landing', AppViewerLanding);
