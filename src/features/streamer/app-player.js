/* eslint-disable no-undef */
import { LitElement, css, html } from 'lit';

export class AppPlayer extends LitElement {
  static styles = css`
    /* default style for the component */
    :host {
      --player-width: 100%;
      --player-height: auto;
      --player-max-width: 100%;
      --player-max-height: none;

      display: block;
      width: var(--player-width);
      height: var(--player-height);
      max-width: var(--player-max-width);
      max-height: var(--player-max-height);
    }

    /* style for fullscreen player */
    :host(.full-screen) {
      width: 100vw;
      height: 100vh;
    }

    /* style for player with aspect ratio of 16:9 when the player doesn't have 100% screen width */
    :host(.ratio-16-9) {
      width: 100%;
      height: auto;
      padding-bottom: calc(9 / 16 * 100%);
      position: relative;
    }

    /* player container will have exact size and ratio with the host component */
    :host(.ratio-16-9) .player-container {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
    }

    /* default style for player container to follow the :host width and height */
    .player-container {
      width: 100%;
      height: 100%;
    }

    /* the video element also follows the size of the container */
    video {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  `;

  static properties = {
    src: { type: String },
    hlsUrl: { type: String },
    dashUrl: { type: String },
    muted: { type: Boolean },
    autoplay: { type: Boolean }
  };

  loadShaka() {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.setAttribute(
        'src',
        'https://ajax.googleapis.com/ajax/libs/shaka-player/3.3.0/shaka-player.compiled.js'
      );
      script.addEventListener('load', () => resolve());
      document.head.appendChild(script);
    });
  }

  async firstUpdated() {
    await this.loadShaka();
    this.initApp();
  }

  initApp() {
    // Install built-in polyfills to patch browser incompatibilities.
    shaka.polyfill.installAll();

    // Check to see if the browser supports the basic APIs Shaka needs.
    if (shaka.Player.isBrowserSupported()) {
      // Everything looks good!
      this.initPlayer();
    } else {
      // This browser does not have the minimum set of APIs we need.
      console.error('Browser not supported!');
    }
  }

  async initPlayer() {
    // Create a Player instance.
    const video = this.renderRoot.querySelector('video');
    video.autoplay = this.autoplay;
    video.muted = this.muted;

    const player = new shaka.Player(video);
    player.configure({
      streaming: {
        lowLatencyMode: true,
        inaccurateManifestTolerance: 0,
        rebufferingGoal: 0.01
      }
    });

    // Attach player to the window to make it easy to access in the JS console.
    window.player = player;

    // Listen for error events.
    player.addEventListener('error', (e) => {
      console.log(e.detail);
    });

    if (window.MediaSource && this.dashUrl) {
      this.src = this.dashUrl;
    } else if (window.MediaSource === undefined && this.hlsUrl) {
      this.src = this.hlsUrl;
    }

    // Try to load a manifest.
    // This is an asynchronous process.
    try {
      await player.load(this.src);
      // This runs if the asynchronous load is successful.
      console.log('The video has now been loaded!');
    } catch (e) {
      // onError is executed if the asynchronous load fails.
      console.log(e);
    }
  }

  render() {
    return html`
      <p>${this.muted}</p>
      <p>${this.autoplay}</p>
      <div class="player-container">
        <video id="inlive-player" controls playsinline></video>
      </div>
    `;
  }
}

window.customElements.define('app-player', AppPlayer);
