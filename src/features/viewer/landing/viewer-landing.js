import { LitElement, css, html } from 'lit';
import './app-stream-info.js';
import './app-join-live.js';

export class ViewerLanding extends LitElement {
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

      .top-info {
        display: flex;
        justify-content: space-between;
        padding: 1rem 0;
        margin-top: 3rem;
      }

      .stream-time {
        font-weight: 600;
        font-size: 14px;
        line-height: 20px;
        text-align: right;
        color: #4b5563;
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
      startTime: { type: String }
    };
  }

  constructor() {
    super();
    this.showErrorText = false;
    this.streamTitle = '';
    this.streamDescription = '';
    this.startTime = '';
  }

  render() {
    return html`
      <div class="landing-container">
        <!-- will change later on -->
        <div class="top-info">
          <div>LIVE</div>
          <div class="stream-time">${this.startTime}</div>
        </div>
        <app-stream-info
          streamTitle=${this.streamTitle}
          streamDescription=${this.streamDescription}
        ></app-stream-info>
        <app-join-live></app-join-live>
      </div>
    `;
  }
}

window.customElements.define('viewer-landing', ViewerLanding);
