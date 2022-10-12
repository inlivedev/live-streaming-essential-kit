import { LitElement, css, html } from 'lit';

export class AppStreamInfo extends LitElement {
  static get styles() {
    return css`
      * {
        margin: 0;
        padding: 0;
        background-color: white;
        font-family: 'Inter';
        font-style: normal;
      }

      .mock-picture {
        height: 12.059rem;
        background: black;
        border-radius: 1rem;
      }

      .text-container {
        margin-top: 2.004rem;
      }

      .stream-title {
        font-weight: 700;
        font-size: 1.25rem;
        line-height: 1.75rem;
        text-align: center;
        color: #1f2937;
      }

      .stream-description {
        font-weight: 400;
        font-size: 0.875rem;
        line-height: 1.25rem;
        color: #6b7280;
        margin-top: 0.25rem;
      }

      @media (min-width: 640px) {
        .stream-description {
          text-align: center;
        }

        .mock-picture {
          width: 21.438rem;
          margin: 0 auto;
        }
      }
    `;
  }

  static get properties() {
    return {
      showErrorText: { type: Boolean },
      streamTitle: { type: String },
      streamDescription: { type: String }
    };
  }

  constructor() {
    super();
    this.showErrorText = false;
    this.streamTitle = '';
    this.streamDescription = '';
  }

  render() {
    return html`
      <div class="stream-info-container">
        <div>
          <div class="mock-picture"></div>
        </div>
        <div class="text-container">
          <div class="stream-title">${this.streamTitle}</div>
          ${this.streamDescription !== ''
            ? html`<div class="stream-description">
                ${this.streamDescription}
              </div>`
            : null}
        </div>
      </div>
    `;
  }
}

window.customElements.define('app-stream-info', AppStreamInfo);
