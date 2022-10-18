import { html, LitElement, css } from 'lit';

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
      background-color: #555;
    }

    @media (min-width: 1024px) {
      .container {
        overflow: hidden;
        border-radius: 1rem;
      }
    }

    .video-ratio {
      position: relative;
      width: 100%;
      height: auto;
      padding-top: calc(9 / 16 * 100%); /* 16:9 ratio */
    }

    .video-player {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      object-fit: cover;
    }
  `;

  render() {
    return html`
      <div class="container">
        <div class="video-ratio">
          <video
            id="video-player"
            class="video-player"
            autoplay
            muted
            playsinline
          ></video>
        </div>
      </div>
    `;
  }
}

customElements.define('app-video-panel', AppVideoPanel);
