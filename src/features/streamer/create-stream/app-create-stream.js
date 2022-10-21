import { LitElement, css, html } from 'lit';
import { fetchHttp } from '../../shared/modules/fetch-http.js';
import './create-stream-form.js';

export class AppCreateStream extends LitElement {
  static get styles() {
    return css`
      * {
        margin: 0;
        padding: 0;
        background-color: white;
        font-family: 'Inter';
        font-style: normal;
      }

      .errorMessage {
        text-align: center;
        margin: 1rem;
        font-weight: 500;
      }
    `;
  }

  static get properties() {
    return {
      authResponse: { state: true },
      errorMessage: { type: String }
    };
  }

  constructor() {
    super();
    this.authResponse = false;
    this.errorMessage = '';
  }

  async userAuthentication() {
    const username = prompt('input your username');
    const password = prompt('input your password');

    const configObject = {
      username: username,
      password: password
    };

    const response = await fetchHttp({
      url: '/api/auth/login-with-credentials',
      method: 'POST',
      body: configObject
    }).catch(
      (error) =>
        (this.errorMessage =
          error.message + ': please input your valid username & password')
    );

    if (response.success) {
      return (this.authResponse = response.success);
    }
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('load', this.userAuthentication.bind(this));
  }

  render() {
    return html`
      ${this.authResponse
        ? html`<create-stream-form></create-stream-form>`
        : html`<p class="errorMessage">${this.errorMessage}</p>`}
    `;
  }
}

window.customElements.define('app-create-stream', AppCreateStream);
