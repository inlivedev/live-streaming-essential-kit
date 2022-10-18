import { css, html, LitElement } from 'lit';

class AppShareMenu extends LitElement {
  static styles = css`
    .share-menu {
      margin: 0;
      padding: 0;
      list-style: none;
    }

    .share-menu-item:not(:last-child) {
      margin-bottom: 0.25rem;
    }

    .share-menu-item-button {
      text-align: left;
      display: block;
      width: 100%;
      padding: 0.5rem;
      font-size: 0.875rem;
      line-height: 1.25rem;
      font-weight: 500;
      color: #4b5563;
      border-radius: 0.25rem;
      white-space: nowrap;
      border: none;
      background: none;
      cursor: pointer;
    }

    .share-menu-item-button:hover {
      background-color: #eff6ff;
    }

    .copy-success-feedback {
      display: none;
      background: #dcfce7;
      border-radius: 0.375rem;
      padding: 0.5rem;
      align-items: center;
      white-space: nowrap;
    }

    .copy-success-feedback-text {
      margin-right: 0.625rem;
      font-weight: 500;
      font-size: 0.875rem;
      line-height: 1.25rem;
      color: #15803d;
    }

    .copy-success-feedback-icon {
      color: #16a34a;
    }
  `;

  static properties = {
    streamUrl: { type: String },
    embedUrl: { type: String }
  };

  constructor() {
    super();
    this.streamUrl = '';
    this.embedUrl = '';
  }

  /**
   * @param {Event & { target: HTMLElement }} event - The event listener object
   */
  async handleCopyEmbedCode(event) {
    try {
      const buttonCopyEmbed = event.target;
      const embedCodeCopied = event.target.nextElementSibling;

      if (buttonCopyEmbed && embedCodeCopied instanceof HTMLElement) {
        buttonCopyEmbed.style.display = 'none';
        embedCodeCopied.style.display = 'flex';

        const iframe = `<iframe width="640" height="360" src="${this.embedUrl}" frameborder="0" allowfullscreen webkitallowfullscreen mozallowfullscreen></iframe>`;

        await navigator.clipboard.writeText(iframe);

        setTimeout(() => {
          buttonCopyEmbed.style.display = 'block';
          embedCodeCopied.style.display = 'none';
        }, 3000);
      }
    } catch (error) {
      console.error('Failed to copy:', error);
      alert('Failed to copy the embed code');
    }
  }

  /**
   * @param {Event & { target: HTMLElement }} event - The event listener object
   */
  async handleCopyLink(event) {
    try {
      const buttonCopyLink = event.target;
      const linkCopied = event.target.nextElementSibling;

      if (buttonCopyLink && linkCopied instanceof HTMLElement) {
        buttonCopyLink.style.display = 'none';
        linkCopied.style.display = 'flex';

        await navigator.clipboard.writeText(this.streamUrl);

        setTimeout(() => {
          buttonCopyLink.style.display = 'block';
          linkCopied.style.display = 'none';
        }, 3000);
      }
    } catch (error) {
      console.error('Failed to copy:', error);
      alert('Failed to copy the link');
    }
  }

  render() {
    const copySuccessFeedback = html`
      <div class="copy-success-feedback">
        <span class="copy-success-feedback-text">Copied to Clipboard</span>
        <span class="copy-success-feedback-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            width="20"
            height="20"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clip-rule="evenodd"
            />
          </svg>
        </span>
      </div>
    `;

    return html`
      <ul class="share-menu">
        <li class="share-menu-item">
          <button
            class="share-menu-item-button"
            type="button"
            @click=${this.handleCopyEmbedCode}
          >
            Copy Embed Code
          </button>
          ${copySuccessFeedback}
        </li>
        <li class="share-menu-item">
          <button
            class="share-menu-item-button"
            type="button"
            @click=${this.handleCopyLink}
          >
            Copy Link
          </button>
          ${copySuccessFeedback}
        </li>
      </ul>
    `;
  }
}

customElements.define('app-share-menu', AppShareMenu);
