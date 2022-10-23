import { css, html, LitElement } from 'lit';
import './app-share-menu.js';
import '../shared/ui/app-dropdown.js';
import { fetchHttp } from '../shared/modules/fetch-http.js';

/**
 * @typedef {import('./app-studio.js').StreamStatusType} StreamStatusType
 */

class AppActionPanel extends LitElement {
  static styles = css`
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    .action-panel {
      display: flex;
      justify-content: space-between;
    }

    .button-share {
      padding: 0.625rem 1rem;
      font-size: 0;
      border: 1px solid #d1d5db;
      box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.05);
      border-radius: 6px;
      color: #6b7280;
      background-color: white;
      cursor: pointer;
    }

    .button-text {
      padding: 0.5rem 1rem;
      font-family: inherit;
      font-size: 1rem;
      line-height: 1.5rem;
      font-weight: 500;
      border: 1px solid #d1d5db;
      box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.05);
      border-radius: 6px;
      color: #6b7280;
      background-color: white;
      cursor: pointer;
    }

    .button-not-live {
      background-color: #2563eb;
      border: solid 1px #2563eb;
      color: #fff;
    }

    .button-live {
      color: #dc2626;
    }

    .button-disabled {
      border: solid 1px #93c5fd;
      background-color: #93c5fd;
      color: #fff;
      cursor: default;
    }

    @media (min-width: 1024px) {
      .action-panel {
        justify-content: flex-end;
        column-gap: 0.75rem;
      }

      .button-share {
        order: 1;
      }

      .button-text {
        order: 2;
      }
    }
  `;

  static properties = {
    streamId: { type: Number },
    streamStatus: { type: String }
  };

  constructor() {
    super();
    /** @type {number | undefined} */
    this.streamId = undefined;
    /** @type {StreamStatusType} */
    this._streamStatus = 'preparing';
  }

  /**
   * Set the streamStatus and trigger update manually
   */
  set streamStatus(value) {
    /**
     * Prevent update this component when the status is connecting
     */
    if (value !== 'connecting') {
      let oldValue = this._streamStatus;
      this._streamStatus = value;
      this.requestUpdate('streamStatus', oldValue);
    }
  }

  /**
   * Get the streamStatus value
   *
   * @returns {StreamStatusType} Returns the streamStatus value
   */
  get streamStatus() {
    return this._streamStatus;
  }

  /**
   * Handle to start a live streaming session
   */
  async handleLiveNow() {
    if (this.streamStatus === 'ready') {
      try {
        await fetchHttp({
          url: '/api/stream/start',
          method: 'POST',
          body: {
            streamId: this.streamId
          }
        });
      } catch (error) {
        console.error(error);
        alert('Failed to start the live streaming');
      }
    }
  }

  /**
   * Handle to end a live streaming session
   */
  async handleLiveEnd() {
    if (this.streamStatus === 'live') {
      try {
        await fetchHttp({
          url: '/api/stream/end',
          method: 'POST',
          body: {
            streamId: this.streamId
          }
        });
      } catch (error) {
        console.error(error);
        alert('Failed to end the live streaming');
      }
    }
  }

  render() {
    return html`
      <div class="action-panel">
        <button
          type="button"
          class=${`button-text ${
            this.streamStatus === 'live' ? `button-live` : `button-not-live`
          } ${
            this.streamStatus !== 'ready' && this.streamStatus !== 'live'
              ? `button-disabled`
              : ``
          }`}
          ?disabled=${this.streamStatus !== 'ready' &&
          this.streamStatus !== 'live'}
          aria-disabled=${this.streamStatus !== 'ready' &&
          this.streamStatus !== 'live'
            ? true
            : false}
          @click=${this.streamStatus === 'ready'
            ? this.handleLiveNow
            : this.streamStatus === 'live'
            ? this.handleLiveEnd
            : undefined}
        >
          ${this.streamStatus === 'live' ? 'End Live' : 'Live Now'}
        </button>
        <app-dropdown
          dropdownButtonId="share-dropdown-button"
          dropdownBodyId="share-dropdown-body"
        >
          <button
            type="button"
            slot="dropdown-button"
            class="button-share"
            aria-label="Share"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              height="20"
              width="20"
            >
              <path
                fill-rule="evenodd"
                d="M15.75 4.5a3 3 0 11.825 2.066l-8.421 4.679a3.002 3.002 0 010 1.51l8.421 4.679a3 3 0 11-.729 1.31l-8.421-4.678a3 3 0 110-4.132l8.421-4.679a3 3 0 01-.096-.755z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
          <div slot="dropdown-body">
            <app-share-menu
              streamUrl=${`${window.location.origin}/streaming/watch/${this.streamId}`}
              embedUrl=${`${window.location.origin}/streaming/embed/${this.streamId}`}
            ></app-share-menu>
          </div>
        </app-dropdown>
      </div>
    `;
  }
}

customElements.define('app-action-panel', AppActionPanel);
