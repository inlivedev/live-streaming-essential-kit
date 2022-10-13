import { LitElement, css, html } from 'lit';

export class ViewerTopBar extends LitElement {
  static get styles() {
    return css`
      * {
        margin: 0;
        padding: 0;
        background-color: white;
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
        font-size: 0.875rem;
        line-height: 1.25rem;
        text-align: right;
        color: #4b5563;
      }

      .outer-box-live {
        padding: 0.125rem 0.75rem;
        background: #fee2e2;
        border-radius: 0.25rem;
      }

      .text-live {
        font-weight: 500;
        font-size: 0.875rem;
        line-height: 1.25rem;
        text-align: center;
        color: #991b1b;
        background: none;
      }

      .outer-box-upcoming {
        padding: 0.125rem 0.75rem;
        background: #dbeafe;
        border-radius: 0.25rem;
      }

      .text-upcoming {
        font-weight: 500;
        font-size: 0.875rem;
        line-height: 1.25rem;
        text-align: center;
        color: #1e40af;
        background: none;
      }

      .outer-box-ended {
        padding: 0.125rem 0.75rem;
        background: #e5e7eb;
        border-radius: 0.25rem;
      }

      .text-ended {
        font-weight: 500;
        font-size: 0.875rem;
        line-height: 1.25rem;
        text-align: center;
        color: #4b5563;
        background: none;
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

window.customElements.define('viewer-top-bar', ViewerTopBar);
