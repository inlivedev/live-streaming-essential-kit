import { LitElement, css, html } from 'lit';
import './app-stream-info.js';
import './app-join-live.js';
import './app-top-bar.js';

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
    this.isScheduled = '';
    this.isEnded = '';
    this.isLive = '';
  }

  render() {
    return html`
      <div class="landing-container">
        <app-top-bar
          startTime=${this.startTime}
          isScheduled=${this.isScheduled}
          isEnded=${this.isEnded}
          isLive=${this.isLive}
        ></app-top-bar>
        <app-stream-info
          streamTitle=${this.streamTitle}
          streamDescription=${this.streamDescription}
        ></app-stream-info>
        <app-join-live></app-join-live>
      </div>
    `;
  }
}

window.customElements.define('app-viewer-landing', AppViewerLanding);
