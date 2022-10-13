import { LitElement, css, html } from 'lit';

export class AppTopBar extends LitElement {
  static get styles() {
    return css`
      * {
        margin: 0;
        padding: 0;
        background-color: white;
        font-family: 'Inter';
        font-style: normal;
      }

      .top-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
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

      .outer-box-live {
        padding: 2px 12px;
        background: #fee2e2;
        border-radius: 4px;
      }

      .text-live {
        font-weight: 500;
        font-size: 14px;
        line-height: 20px;
        text-align: center;
        color: #991b1b;
        background: none;
      }

      .outer-box-upcoming {
        padding: 2px 12px;
        background: #dbeafe;
        border-radius: 4px;
      }

      .text-upcoming {
        font-weight: 500;
        font-size: 14px;
        line-height: 20px;
        text-align: center;
        color: #1e40af;
        background: none;
      }

      .outer-box-ended {
        padding: 2px 12px;
        background: #e5e7eb;
        border-radius: 4px;
      }

      .text-ended {
        font-weight: 500;
        font-size: 14px;
        line-height: 20px;
        text-align: center;
        color: #4b5563;
        background: none;
      }

      @media (min-width: 640px) {
      }
    `;
  }

  static get properties() {
    return {
      startTime: { type: String },
      isScheduled: { type: String },
      isEnded: { type: String },
      isLive: { type: String }
    };
  }

  constructor() {
    super();
    this.startTime = '';
    this.isScheduled = '';
    this.isEnded = '';
    this.isLive = '';
  }

  render() {
    return html`
      <!-- can be changed later on with lozenges component -->
      <div class="top-info">
        ${this.isLive === 'true'
          ? html`<div class="outer-box-live">
              <p class="text-live">LIVE</p>
            </div>`
          : this.isScheduled === 'true'
          ? html`<div class="outer-box-upcoming">
              <p class="text-upcoming">UPCOMING</p>
            </div>`
          : this.isEnded === 'true'
          ? html`<div class="outer-box-ended">
              <p class="text-ended">ENDED</p>
            </div>`
          : null}

        <div class="stream-time">${this.startTime}</div>
      </div>
    `;
  }
}

window.customElements.define('app-top-bar', AppTopBar);