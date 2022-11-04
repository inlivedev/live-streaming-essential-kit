import { css, html, LitElement } from 'lit';

class AppDropdown extends LitElement {
  static styles = css`
    :host {
      position: relative;
    }

    .dropdown-button {
      border: none;
      background: none;
      padding: 0;
      margin: 0;
      cursor: pointer;
    }

    .dropdown-button > * {
      pointer-events: none;
    }

    .dropdown-body {
      visibility: hidden;
      opacity: 0;
      border-radius: 0.5rem;
      background-color: white;
      padding: 0.5rem;
      box-shadow: 0px 10px 15px -3px rgba(0, 0, 0, 0.1),
        0px 4px 6px -2px rgba(0, 0, 0, 0.05);
      border: 1px solid #e5e7eb;
      position: absolute;
      right: 0;
      top: 3rem;
      z-index: 30;
    }
  `;

  static properties = {
    dropdownButtonId: { type: String },
    dropdownBodyId: { type: String }
  };

  constructor() {
    super();
    this.dropdownButtonId = '';
    this.dropdownBodyId = '';
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('click', this.handleClosure);
    window.addEventListener('focusin', this.handleClosure);
  }

  /**
   *
   * @param {Event} event - The event listener object
   */
  handleClosure = (event) => {
    const composedPath = event.composedPath();

    if (this.dropdownBody && !composedPath.includes(this.dropdownBody)) {
      this.hideDropdown();
    }
  };

  showDropdown() {
    if (this.dropdownToggleButton && this.dropdownBody) {
      this.dropdownToggleButton.setAttribute('aria-expanded', 'true');
      this.dropdownBody.setAttribute('aria-hidden', 'false');
      this.dropdownBody.style.visibility = 'visible';
      this.dropdownBody.style.opacity = '1';
      this.dropdownBody.style.display = 'block';
    }
  }

  hideDropdown() {
    if (this.dropdownToggleButton && this.dropdownBody) {
      this.dropdownToggleButton.setAttribute('aria-expanded', 'false');
      this.dropdownBody.setAttribute('aria-hidden', 'true');
      this.dropdownBody.style.visibility = 'hidden';
      this.dropdownBody.style.opacity = '0';
      this.dropdownBody.style.display = 'none';
    }
  }

  /**
   *
   * @param {Event} event - The event listener object
   */
  handleDropdownToggleButton(event) {
    event.stopPropagation();

    const isShown = this.dropdownToggleButton
      ? this.dropdownToggleButton.getAttribute('aria-expanded') || 'false'
      : 'false';

    if (JSON.parse(isShown)) {
      this.hideDropdown();
    } else {
      this.showDropdown();
    }
  }

  /**
   * @returns {HTMLElement | null} Returns element with dropdown-button class
   */
  get dropdownToggleButton() {
    return this.renderRoot.querySelector('.dropdown-button');
  }

  /**
   * @returns {HTMLElement | null} Returns element with dropdown-body class
   */
  get dropdownBody() {
    return this.renderRoot.querySelector('.dropdown-body');
  }

  render() {
    return html`
      <slot
        name="dropdown-button"
        id=${this.dropdownButtonId}
        class="dropdown-button"
        aria-expanded="false"
        aria-controls=${this.dropdownBodyId}
        type="button"
        @click=${this.handleDropdownToggleButton}
      ></slot>
      <div
        tabindex="-1"
        id=${this.dropdownBodyId}
        aria-hidden="true"
        aria-labelledby=${this.dropdownButtonId}
        class="dropdown-body"
      >
        <slot name="dropdown-body"></slot>
      </div>
    `;
  }
}

customElements.define('app-dropdown', AppDropdown);
