import { LitElement, css, html } from 'lit';

export class ViewerStreamInfo extends LitElement {
  static get styles() {
    return css`
      * {
        margin: 0;
        padding: 0;
        font-style: normal;
      }

      .text-container {
        margin-top: 1rem;
        padding: 0 1rem;
      }

      .stream-title {
        font-weight: 700;
        font-size: 1.5rem;
        line-height: 2rem;
        text-align: center;
        color: #1f2937;
      }

      .stream-description {
        font-weight: 400;
        font-size: 1rem;
        line-height: 1.5rem;
        color: #6b7280;
        margin-top: 0.75rem;
        text-align: center;
      }

      @media (min-width: 1024px) {
        .text-container {
          width: 68%;
          margin: 1rem auto 0 auto;
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
        <div class="text-container">
          <div class="stream-title">${this.streamTitle}</div>
          <div class="stream-description">${this.streamDescription}</div>
        </div>
      </div>
    `;
  }
}

window.customElements.define('viewer-stream-info', ViewerStreamInfo);
