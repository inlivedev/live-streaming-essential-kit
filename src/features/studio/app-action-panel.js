import { css, html, LitElement } from 'lit';
import './app-share-menu.js';
import '../shared/ui/app-dropdown.js';

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

    .button-live {
      background-color: #2563eb;
      border: solid 1px #2563eb;
      color: #fff;
    }

    .button-end {
      color: #dc2626;
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
    streamStatus: { type: String }
  };

  constructor() {
    super();
    this.streamStatus = '';
  }

  handleLiveNow() {
    //
  }

  handleLiveEnd() {
    //
  }

  render() {
    return html`
      <div class="action-panel">
        ${this.streamStatus === 'live'
          ? html`
              <button
                type="button"
                class="button-text button-end"
                @click=${this.handleLiveEnd}
              >
                End Live
              </button>
            `
          : html`
              <button
                type="button"
                class="button-text button-live"
                @click=${this.handleLiveNow}
              >
                Live Now
              </button>
            `}

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
            <app-share-menu streamUrl="" embedUrl=""></app-share-menu>
          </div>
        </app-dropdown>
      </div>
    `;
  }
}

customElements.define('app-action-panel', AppActionPanel);
