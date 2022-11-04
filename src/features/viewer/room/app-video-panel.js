import { html, LitElement, css } from 'lit';
import '../../player/app-player.js';

class AppVideoPanel extends LitElement {
  static styles = css`
    :host {
      display: flex;
      align-items: center;
      width: 100%;
      height: 100%;
    }

    .container {
      flex: 1;
      background-color: #121212;
    }

    @media (min-width: 1024px) {
      .container {
        overflow: hidden;
        border-radius: 1rem;
      }
    }
  `;

  static properties = {
    hlsManifest: { type: String },
    dashManifest: { type: String }
  };

  constructor() {
    super();
    this.hlsManifest = '';
    this.dashManifest = '';
  }

  render() {
    return html`
      <div class="container">
        <app-player
          class="ratio-16-9"
          src=${this.hlsManifest}
          dashUrl=${this.dashManifest}
          hlsUrl=${this.hlsManifest}
          autoplay
          muted
        ></app-player>
      </div>
    `;
  }
}

customElements.define('app-video-panel', AppVideoPanel);
