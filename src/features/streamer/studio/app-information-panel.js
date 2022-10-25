import { html, LitElement, css } from 'lit';
import '../../shared/ui/app-viewer-count.js';
import '../../shared/ui/app-lozenge.js';
import '../../shared/ui/app-timer-counter.js';

/**
 * @typedef {import('./app-studio.js').StreamStatusType} StreamStatusType
 */

export class AppInformationPanel extends LitElement {
  static styles = css`
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    .information-panel {
      padding-left: 1rem;
      padding-right: 1rem;
    }

    .heading {
      font-weight: 600;
      font-size: 1rem;
      line-height: 1.5rem;
    }

    .description {
      display: none;
      font-size: 0.875rem;
      line-height: 1.25rem;
      color: #6b7280;
    }
    .status-panel {
      display: flex;
      justify-content: space-between;
      margin-top: 0.25rem;
    }

    .lozenge-wrapper {
      display: flex;
      column-gap: 0.25rem;
    }

    .lozenge-preparing {
      --background-color: #fef3c7;
      --color: #92400e;
    }

    .lozenge-connecting {
      --background-color: #fef3c7;
      --color: #92400e;
    }

    .lozenge-ready {
      --background-color: #d1fae5;
      --color: #065f46;
    }

    .lozenge-live {
      --background-color: #dc2626;
      --color: #fff;
      --font-weight: 700;
    }

    .lozenge-ended {
      --background-color: #f3f4f6;
      --color: #1f2937;
    }

    @media (min-width: 1024px) {
      .information-panel {
        display: flex;
        flex-direction: column;
        margin-bottom: 5rem;
      }

      .heading {
        order: 2;
        color: #1f2937;
        font-size: 1.25rem;
        line-height: 1.75rem;
        font-weight: 700;
        margin-top: 1rem;
      }

      .description {
        order: 3;
        display: inline-block;
      }

      .status-panel {
        order: 1;
        margin-top: 1rem;
      }
    }
  `;

  static properties = {
    heading: { type: String },
    description: { type: String },
    streamStatus: { type: String },
    endTime: { type: String },
    startTime: { type: String }
  };

  constructor() {
    super();
    /** @type {string} */
    this.heading = '';
    /** @type {string} */
    this.description = '';
    /** @type {StreamStatusType} */
    this.streamStatus = 'preparing';
    /** @type {string | undefined} */
    this.endTime = undefined;
    /** @type {string | undefined} */
    this.startTime = undefined;
  }

  /**
   * @param {{ has: (arg0: string) => any; }} changedProperties changed properties name
   */
  updated(changedProperties) {
    //check for the streamState changes
    if (changedProperties.has('streamStatus')) {
      this.handleTimer();
    }
  }

  handleTimer() {
    const appTimerCounter = this.renderRoot.querySelector('app-timer-counter');

    if (this.streamStatus === 'live' && appTimerCounter) {
      //we don't need start time param when the stream is just started to live
      appTimerCounter.handleStartTimer();
    } else if (this.streamStatus === 'end' && appTimerCounter) {
      appTimerCounter.handleEndTimer();

      //when loaded on first time, if the stream has already ended, will get the previous stream duration
      if (this.startTime && this.endTime) {
        const startTime = new Date(this.startTime).getTime();
        const endTime = new Date(this.endTime).getTime();
        const substractTime = endTime - startTime;
        appTimerCounter.handleFormatTime(substractTime);
      }
    }
  }

  render() {
    return html`
      <div class="information-panel">
        <h1 class="heading">${this.heading}</h1>
        ${this.description
          ? html` <p class="description">${this.description}</p> `
          : undefined}
        <div class="status-panel">
          ${this.streamStatus === 'preparing'
            ? html`
                <app-lozenge class="lozenge-preparing">
                  Preparing...
                </app-lozenge>
              `
            : this.streamStatus === 'ready'
            ? html`
                <app-lozenge class="lozenge-ready">Ready to Live</app-lozenge>
              `
            : this.streamStatus === 'live' || this.streamStatus === 'end'
            ? html`
                <div class="lozenge-wrapper">
                  ${this.streamStatus === 'live'
                    ? html`<app-lozenge class="lozenge-live">LIVE</app-lozenge>`
                    : this.streamStatus === 'end'
                    ? html`<app-lozenge class="lozenge-ended"
                        >Live Ended</app-lozenge
                      >`
                    : undefined}
                  ${this.streamStatus === 'live' || this.streamStatus === 'end'
                    ? html`<app-lozenge
                        ><app-timer-counter></app-timer-counter
                      ></app-lozenge>`
                    : undefined}
                </div>
              `
            : html`
                <app-lozenge class="lozenge-connecting">
                  Connecting...
                </app-lozenge>
              `}
          <app-viewer-count></app-viewer-count>
        </div>
      </div>
    `;
  }
}

customElements.define('app-information-panel', AppInformationPanel);
