import { html, LitElement, css } from 'lit';

class AppViewerCount extends LitElement {
  static styles = css`
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    .viewer-count {
      display: flex;
      align-items: center;
      background-color: #111827;
      border-radius: 0.25rem;
      padding: 0.125rem 0.5rem;
    }

    .viewer-count-icon {
      display: flex;
      align-items: center;
      margin-right: 0.5rem;
    }

    .viewer-count-text-wrapper {
      font-size: 0.875rem;
      line-height: 1.25rem;
    }

    .viewer-count-number {
      font-variant-numeric: tabular-nums;
    }

    .viewer-count-text {
      display: none;
    }

    .icon {
      width: 1rem;
      height: 1rem;
    }

    @media (min-width: 1024px) {
      .viewer-count {
        color: #475569;
        background-color: transparent;
      }

      .viewer-count-text {
        display: inline-block;
      }

      .icon {
        width: 1.25rem;
        height: 1.25rem;
      }
    }
  `;

  static properties = {
    viewerCount: { type: Number }
  };

  constructor() {
    super();
    /** @type {number} */
    this.viewerCount = 0;
  }

  render() {
    return html`
      <div class="viewer-count">
        <div class="viewer-count-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="icon"
          >
            <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
            <path
              fill-rule="evenodd"
              d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <p class="viewer-count-text-wrapper">
          <span class="viewer-count-number">${this.viewerCount}</span>
          <span class="viewer-count-text">watching now</span>
        </p>
      </div>
    `;
  }
}

customElements.define('app-viewer-count', AppViewerCount);
