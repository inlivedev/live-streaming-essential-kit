import { LitElement, css, html } from 'lit';
import { InliveApp } from '@inlivedev/inlive-js-sdk/app';
import { InliveStream } from '@inlivedev/inlive-js-sdk/stream';

export class CreateStream extends LitElement {
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
        font-size: 24px;
        line-height: 32px;
        color: #1f2937;
        margin-top: 10rem;
        margin-bottom: 2rem;
      }

      .create-form {
        margin: 0 auto;
        text-align: left;
        display: flex;
        flex-direction: column;
      }

      .stream-title {
        font-weight: 500;
        font-size: 14px;
        line-height: 20px;
        color: #374151;
        margin-bottom: 0.25rem;
      }

      .input-field {
        width: 320px;
        padding: 9px 13px;
        background: #ffffff;
        box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.05);
        border-radius: 6px;
      }

      .input-field.gray {
        border: 1px solid #d1d5db;
      }

      .input-field.red {
        border: 1px solid red;
      }

      .input-field:focus {
        border: 1px solid #3b82f6;
        box-shadow: 0px 0px 0px 2px #bfdbfe;
        outline: none;
      }

      .input-field-description {
        width: 320px;
        height: 105px;
        padding: 9px 13px;
        background: #ffffff;
        border: 1px solid #d1d5db;
        box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.05);
        border-radius: 6px;
      }

      .input-field-description:focus {
        border: 1px solid #3b82f6;
        box-shadow: 0px 0px 0px 2px #bfdbfe;
        outline: none;
      }

      ::placeholder {
        font-weight: 400;
        font-size: 14px;
        line-height: 20px;
        color: rgba(107, 114, 128, 0.8);
      }

      .input-description-note {
        font-weight: 400;
        font-size: 12px;
        line-height: 16px;
        color: #9ca3af;
        margin-top: 0.125rem;
      }

      .title-container {
        display: flex;
        flex-direction: column;
      }

      .description-container {
        margin-top: 1rem;
      }

      .optinal-note {
        color: #9ca3af;
      }

      .submit-button {
        width: 131px;
        padding: 9px 17px;
        border: none;
        background: #2563eb;
        box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.05);
        border-radius: 6px;
        font-weight: 500;
        font-size: 14px;
        line-height: 20px;
        color: #ffffff;
        cursor: pointer;
        align-self: end;
      }

      .error {
        border: 1px solid red;
        box-shadow: 0px 0px 0px 2px red;
        outline: none;
      }

      .error-text {
        color: red;
        font-weight: 500;
        margin-top: 0.25rem;
      }

      @media (min-width: 640px) {
        .input-field {
          width: 480px;
        }

        .input-field-description {
          width: 480px;
        }
      }
    `;
  }

  static get properties() {
    return {
      showErrorText: { type: Boolean }
    };
  }

  constructor() {
    super();
    this.showErrorText = false;
  }

  /**
   * Check if input has value
   *
   * @param {string} input
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
   * Func to create stream with create stream SDK module
   *
   * @param {object} inliveApp api key
   * @param {{ name: string; description: string; }} configObject stream title & desc
   */
  async createStream(inliveApp, configObject) {
    // from SDK
    const dataStream = await InliveStream.createStream(inliveApp, configObject);

    if (dataStream.status.code === 200) {
      window.location.replace('/live-stream/' + dataStream.data.id);
    } else {
      throw new Error('Failed to create broadcast');
    }
  }

  /**
   * Func submit form
   *
   * @param {{ preventDefault: () => void; }} e event
   */
  submit(e) {
    e.preventDefault();
    const form = this.renderRoot.querySelector('form[id="create-stream-form"]');

    const configObject = {
      name: form ? this.hasValue(form['title'].value) : '',
      description: form ? form['description'].value || '' : ''
    };

    // trial hard-code
    let config = {
      api_key:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NjU5ODI0NjAsImp0aSI6ImY2M2IzNjU5LTIyMGMtNDM5MC1hYmJiLTgyNGRmZjg2MjdmNCIsImlhdCI6MTY2NTM3NzY2MCwiaXNzIjoiaW5saXZlIiwiZGJpZCI6MzgsIlRva2VuVHlwZSI6ImFwaWtleSIsIlVzZXIiOnsiaWQiOjMxLCJ1c2VybmFtZSI6IiIsInBhc3N3b3JkIjoiIiwiY29uZmlybV9wYXNzd29yZCI6IiIsIm5hbWUiOiIiLCJsb2dpbl90eXBlIjowLCJlbWFpbCI6IiIsInJvbGVfaWQiOjAsInBpY3R1cmVfdXJsIjoiIiwiaXNfYWN0aXZlIjpmYWxzZSwicmVnaXN0ZXJfZGF0ZSI6IjAwMDEtMDEtMDFUMDA6MDA6MDBaIiwidXBkYXRlZF9kYXRlIjpudWxsfX0.mgNE8V0GR0fdF7fe0efsr_nztzsIdmur9mnvQ-7DXJ4'
    };

    const inliveApp = InliveApp.init(config);

    if (configObject.name !== undefined && configObject.name !== null) {
      // trigger create function
      this.createStream(inliveApp, configObject);
    }
  }

  render() {
    return html`
      <div class="create-stream-container">
        <p class="create-main-title">Create new live stream</p>
        <div class="create-form">
          <form id="create-stream-form">
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
                : null}
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
          </form>

          <button type="submit" class="submit-button" @click=${this.submit}>
            Create Stream
          </button>
        </div>
      </div>
    `;
  }
}

window.customElements.define('create-stream', CreateStream);
