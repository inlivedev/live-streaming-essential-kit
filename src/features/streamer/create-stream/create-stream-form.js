import { LitElement, css, html } from 'lit';
import { fetchHttp } from '../../shared/modules/fetch-http.js';

export class CreateStreamForm extends LitElement {
  static get styles() {
    return css`
      * {
        margin: 0;
        padding: 0;
        background-color: white;
        font-family: 'Inter';
        font-style: normal;
      }

      .create-stream-container {
        display: flex;
        flex-direction: column;
        text-align: center;
      }

      .create-main-title {
        font-weight: 700;
        font-size: 1.5rem;
        line-height: 2rem;
        color: #1f2937;
        margin-top: 10rem;
        margin-bottom: 2rem;
      }

      .create-form {
        margin: 0 auto;
        text-align: left;
        display: flex;
        flex-direction: column;
        width: 21.438rem;
      }

      .form-containter {
        display: flex;
        flex-direction: column;
      }

      .stream-title {
        font-weight: 500;
        font-size: 0.875rem;
        line-height: 1.25rem;
        color: #374151;
        margin-bottom: 0.25rem;
      }

      .input-field {
        width: auto;
        padding: 0.563rem 0.813rem;
        background: #ffffff;
        box-shadow: 0px 0.063rem 0.125rem rgba(0, 0, 0, 0.05);
        border-radius: 0.375rem;
      }

      .input-field.gray {
        border: 1px solid #d1d5db;
      }

      .input-field.red {
        border: 1px solid red;
      }

      .input-field:focus {
        border: 1px solid #3b82f6;
        box-shadow: 0px 0px 0px 0.125rem #bfdbfe;
        outline: none;
      }

      .input-field-description {
        width: auto;
        height: 6.563rem;
        padding: 0.563rem 0.813rem;
        background: #ffffff;
        box-shadow: 0px 0.063rem 0.125rem rgba(0, 0, 0, 0.05);
        border-radius: 0.375rem;
        border: 1px solid #d1d5db;
      }

      .input-field-description:focus {
        border: 1px solid #3b82f6;
        box-shadow: 0px 0px 0px 0.125rem #bfdbfe;
        outline: none;
      }

      ::placeholder {
        font-weight: 400;
        font-size: 0.875rem;
        line-height: 1.25rem;
        color: rgba(107, 114, 128, 0.8);
      }

      .input-description-note {
        font-weight: 400;
        font-size: 0.75rem;
        line-height: 1rem;
        color: #9ca3af;
        margin-top: 0.125rem;
      }

      .title-container {
        display: flex;
        flex-direction: column;
      }

      .description-container {
        display: flex;
        flex-direction: column;
        margin-top: 1rem;
      }

      .optinal-note {
        color: #9ca3af;
      }

      .submit-button {
        width: 21.438rem;
        position: absolute;
        bottom: 2.5rem;
        padding: 0.563rem 1.063rem;
        border: none;
        background: #2563eb;
        box-shadow: 0px 0.063rem 0.125rem rgba(0, 0, 0, 0.05);
        border-radius: 0.375rem;
        font-weight: 500;
        font-size: 0.875rem;
        line-height: 1.25rem;
        color: #ffffff;
        cursor: pointer;
        align-self: center;
      }

      .error {
        border: 1px solid red;
        box-shadow: 0px 0px 0px 0.125rem red;
        outline: none;
      }

      .error-text {
        color: red;
        font-weight: 500;
        margin-top: 0.25rem;
      }

      @media (min-width: 1024px) {
        .create-form {
          width: 30rem;
        }

        .submit-button {
          position: static;
          width: 8.188rem;
          align-self: end;
        }
      }
    `;
  }

  static get properties() {
    return {
      showErrorText: { state: true }
    };
  }

  constructor() {
    super();
    this.showErrorText = false;
  }

  /**
   * Check if input has value
   *
   * @param {string} input input stream name
   * @returns {any} can be text if there's input text, or just boolean show error text
   */
  hasValue(input) {
    if (input.trim() === '') {
      // if title not input
      this.showErrorText = true;
    } else {
      // if title input
      this.showErrorText = false;
      return input;
    }
  }

  /**
   * Func submit form to fetch using create stream
   *
   * @param {{ preventDefault: () => void; target: any; }} event event
   */
  async handleSubmit(event) {
    event.preventDefault();
    const form = event.target;

    const configObject = {
      name: this.hasValue(form['title'].value),
      description: form['description'].value || ''
    };

    if (configObject.name) {
      const createStreamResponse = await fetchHttp({
        url: '/api/stream/create',
        method: 'POST',
        body: configObject
      }).catch((error) => alert('Failed to create stream: ' + error.message));

      if (createStreamResponse && createStreamResponse.status.code === 200) {
        window.location.href = `/streaming/studio/${createStreamResponse.data.id}`;
      }
    }
  }

  render() {
    return html`
      <div class="create-stream-container">
        <p class="create-main-title">Create new live stream</p>
        <div class="create-form">
          <form
            class="form-containter"
            id="create-stream-form"
            @submit=${this.handleSubmit}
          >
            <div class="title-container">
              <p class="stream-title">Stream Title</p>
              <input
                class="input-field ${this.showErrorText ? 'red' : 'gray'}"
                type="text"
                name="title"
                placeholder="What do you want to stream"
              />
              ${this.showErrorText
                ? html`<small class="error-text"
                    >Please input stream title</small
                  >`
                : undefined}
            </div>
            <div class="description-container">
              <div class="stream-title">
                <span>Description </span
                ><span class="optinal-note">(optional)</span>
              </div>
              <textarea
                class="input-field-description"
                maxlength="280"
                type="text"
                name="description"
                placeholder="Short description about this stream"
              ></textarea>
              <p class="input-description-note">max 280 characters</p>
            </div>

            <button type="submit" class="submit-button">Create Stream</button>
          </form>
        </div>
      </div>
    `;
  }
}

window.customElements.define('create-stream-form', CreateStreamForm);
