import { LitElement, css, html } from 'lit';

export class ViewerJoinLive extends LitElement {
  static get styles() {
    return css`
      * {
        margin: 0;
        padding: 0;
        background-color: white;
        font-style: normal;
      }

      .input-field {
        width: auto;
        padding: 0.563rem 0.813rem;
        background: #ffffff;
        box-shadow: 0px 0.063rem 0.125rem rgba(0, 0, 0, 0.05);
        border-radius: 0.375rem;
        outline: none;
        font-weight: 400;
        font-size: 1rem;
        line-height: 1.5rem;
        color: rgba(107, 114, 128, 0.8);
      }

      .input-field.gray {
        border: 1px solid #d1d5db;
      }

      .input-field.red {
        border: 1px solid #ef4444;
      }

      .input-field:focus {
        border: 1px solid #3b82f6;
        box-shadow: 0px 0px 0px 0.125rem #bfdbfe;
        outline: none;
      }

      .note-text {
        margin-top: 0.125rem;
        margin-bottom: 1rem;
        font-weight: 400;
        font-size: 0.75rem;
        line-height: 1rem;
      }

      .note-text.gray {
        color: #9ca3af;
      }

      .note-text.red {
        color: #ef4444;
      }

      .join-form {
        margin: 0 auto;
        text-align: left;
        display: flex;
        flex-direction: column;
        width: 100%;
        position: absolute;
        bottom: 2.5rem;
        align-self: center;
        width: 92%;
      }

      .join-container {
        display: flex;
        flex-direction: column;
      }

      .username-text {
        font-weight: 500;
        font-size: 0.875rem;
        line-height: 1.25rem;
        color: #374151;
        margin-bottom: 0.25rem;
      }

      .submit-button {
        width: 100%;
        padding: 0.563rem 1.063rem;
        border: none;
        background: #2563eb;
        box-shadow: 0px 0.063rem 0.125rem rgba(0, 0, 0, 0.05);
        border-radius: 0.375rem;
        font-weight: 500;
        font-size: 0.875rem;
        line-height: 1.25rem;
        color: #ffffff;
        align-self: center;
        opacity: 0.4;
        cursor: not-allowed;
      }

      .submit-button.enable {
        opacity: 1;
        cursor: pointer;
      }

      @media (min-width: 1024px) {
        .join-form {
          width: 30rem;
        }

        .submit-button {
          width: 8.188rem;
          align-self: end;
        }

        .join-form {
          position: static;
          margin-top: 2rem;
        }
      }
    `;
  }

  static get properties() {
    return {
      showError: { type: Boolean },
      streamId: { type: String },
      streamStatus: { type: String },
      enabledButton: { type: Boolean }
    };
  }

  constructor() {
    super();
    this.showError = false;
    this.streamId = '';
    this.streamStatus = '';
    this.enabledButton = false;
  }

  /**
   * To check input box is typed
   *
   * @param {string} inputText input text when typing
   */
  enableDisableButton(inputText) {
    this.enabledButton = inputText.trim() !== '' ? true : false;
  }

  /**
   * Check if the given string consists of alpha numeric only
   *
   * @param {string} string input text checking
   * @returns {any} is the string match
   */
  isAlphaNumeric(string) {
    return string.match(/^[\dA-Za-z]+$/);
  }

  /**
   * Check if input has value
   *
   * @param {string} input username that being input
   * @returns {any} can be text if there's input text, or just boolean show error text
   */
  checkValue(input) {
    if (input.trim() === '' || input.trim().length < 3) {
      // if username not input & less than 3
      this.showError = true;
    } else if (!this.isAlphaNumeric(input)) {
      // if input username not alphanumeric
      this.showError = true;
    } else {
      // if username input
      this.showError = false;
      return input;
    }
  }

  /**
   * Func submit form
   *
   * @param {{ preventDefault: () => void; }} event event
   * @returns {any} go to the watching page
   */
  submit(event) {
    event.preventDefault();
    const form = this.renderRoot.querySelector('form[id="join-stream-form"]');

    const username = form ? this.checkValue(form['username'].value) : undefined;

    if (username !== undefined && username !== null) {
      // save the username into local storage
      localStorage.setItem('viewer-username', username);

      // go to the next page
      return window.location.replace('/streaming/watch/' + this.streamId);
    }
  }

  render() {
    return html`
      <div class="join-form">
        <form id="join-stream-form">
          <div class="join-container">
            <p class="username-text">Username</p>
            <input
              class="input-field ${this.showError ? 'red' : 'gray'}"
              type="text"
              name="username"
              placeholder="Set username to watch"
              minlength="3"
              @keyup=${(/** @type {{ target: { value: any; }; }} */ event) =>
                this.enableDisableButton(event.target.value)}
            />
            <p class="note-text ${this.showError ? 'red' : 'gray'}">
              Min 3 characters and alphanumeric only
            </p>
          </div>
        </form>
        <button
          type="submit"
          class="submit-button ${this.enabledButton &&
          this.streamStatus === 'streamLive'
            ? 'enable'
            : undefined}"
          @click="${this.enabledButton && this.streamStatus === 'streamLive'
            ? this.submit
            : undefined}"
        >
          Watch Live
        </button>
      </div>
    `;
  }
}

window.customElements.define('viewer-join-live', ViewerJoinLive);
