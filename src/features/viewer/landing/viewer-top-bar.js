import { LitElement, css, html } from 'lit';

export class ViewerTopBar extends LitElement {
  static get styles() {
    return css`
      * {
        margin: 0;
        padding: 0;
        font-style: normal;
      }

      .top-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
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
      streamStatus: { type: String }
    };
  }

  constructor() {
    super();
    this.startTime = '';
    this.streamStatus = '';
  }

  render() {
    return html`
      <!-- can be changed later on with lozenges component -->
      <div class="top-info">
        ${this.streamStatus === 'streamLive'
          ? html`<div class="outer-box-live">
              <p class="text-live">LIVE</p>
            </div>`
          : undefined}
        ${this.streamStatus === 'streamScheduled'
          ? html`<div class="outer-box-upcoming">
              <p class="text-upcoming">UPCOMING</p>
            </div>`
          : undefined}
        ${this.streamStatus === 'streamEnded'
          ? html`<div class="outer-box-ended">
              <p class="text-ended">ENDED</p>
            </div>`
          : undefined}

        <div class="stream-time">${this.startTime}</div>
      </div>
    `;
  }
}

window.customElements.define('viewer-top-bar', ViewerTopBar);
