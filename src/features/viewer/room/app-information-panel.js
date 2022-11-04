import { html, LitElement, css } from 'lit';
import '../../shared/ui/app-viewer-count.js';
import '../../shared/ui/app-lozenge.js';
import '../../shared/ui/app-timer-counter.js';
import { handleTimer } from '../../shared/modules/handle-timer.js';

/**
 * @typedef {import('./app-viewer-room.js').StreamStatusType} StreamStatusType
 */

/**
 * @typedef {import('./app-viewer-room.js').StreamStatusType} StreamStatusType
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

    .truncate {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
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

    .lozenge-upcoming {
      --background-color: #dbeafe;
      --color: #1e40af;
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
    this.streamStatus = 'upcoming';
    /** @type {string | undefined} */
    this.endTime = undefined;
    /** @type {string | undefined} */
    this.startTime = undefined;
  }

  /**
   * @param {{ has: (arg0: string) => any; }} changedProperties changed properties names
   */
  updated(changedProperties) {
    //check for the streamState changes
    if (changedProperties.has('streamStatus')) {
      const appTimerCounter =
        this.renderRoot.querySelector('app-timer-counter');
      handleTimer(
        appTimerCounter,
        this.streamStatus,
        this.startTime,
        this.endTime
      );
    }
  }

  render() {
    return html`
      <div class="information-panel">
        <h1 class="heading truncate">${this.heading}</h1>
        ${this.description
          ? html` <p class="description">${this.description}</p> `
          : undefined}
        <div class="status-panel">
          ${this.streamStatus === 'live'
            ? html`
                <div class="lozenge-wrapper">
                  <app-lozenge class="lozenge-live">LIVE</app-lozenge>
                  <app-lozenge
                    ><app-timer-counter></app-timer-counter
                  ></app-lozenge>
                </div>
              `
            : this.streamStatus === 'end'
            ? html`
                <div class="lozenge-wrapper">
                  <app-lozenge class="lozenge-ended">Live Ended</app-lozenge>
                  <app-lozenge
                    ><app-timer-counter></app-timer-counter
                  ></app-lozenge>
                </div>
              `
            : html`
                <app-lozenge class="lozenge-upcoming">Upcoming</app-lozenge>
              `}
          <app-viewer-count></app-viewer-count>
        </div>
      </div>
    `;
  }
}

customElements.define('app-information-panel', AppInformationPanel);
