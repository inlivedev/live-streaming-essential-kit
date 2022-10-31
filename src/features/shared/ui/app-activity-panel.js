import { css, html, LitElement } from 'lit';
import { fetchHttp } from '../modules/fetch-http.js';

class AppActivityPanel extends LitElement {
  static styles = css`
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    :host {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .activity-panel-heading {
      display: none;
      border-top: 1px solid #d1d5db;
      border-bottom: 1px solid #d1d5db;
      padding: 0.5rem;
      font-weight: 600;
      font-size: 0.875rem;
      line-height: 1.25rem;
      color: #4b5563;
      background-color: white;
    }

    .activity-panel-body {
      flex: 1;
      background-color: transparent;
    }

    .activity-panel-list {
      display: flex;
      flex-direction: column;
      list-style: none;
      padding: 0.5rem 0;
      overflow-y: auto;
      height: 14rem;
    }

    .activity-log,
    .activity-chat {
      margin-bottom: 0.5rem;
    }

    .activity-log-message {
      display: inline-flex;
      padding: 0.125rem 0.5rem;
      background-color: rgba(0, 0, 0, 0.3);
      border-radius: 0.5rem;
      font-size: 0.75rem;
      line-height: 1rem;
    }

    .activity-chat-wrapper {
      display: inline-flex;
      align-items: center;
      padding: 0.125rem 0.5rem;
      background-color: rgba(0, 0, 0, 0.3);
      border-radius: 0.5rem;
      font-size: 0.75rem;
      line-height: 1rem;
    }

    .activity-chat-name {
      font-weight: 600;
      color: #f9fafb;
    }

    .activity-chat-message {
      margin-left: 0.25rem;
    }

    .activity-panel-footer {
      display: flex;
      justify-content: center;
      width: 100%;
    }

    .form-input-field {
      width: 92%;
      background: #ffffff;
      border: 1px solid #d1d5db;
      box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.05);
      border-radius: 6px;
      padding: 0.563rem 0.813rem;
      margin-bottom: 1.688rem;
    }

    .form-input-field:focus {
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

    .button-submit {
      position: absolute;
      right: 2rem;
      bottom: 2rem;
      border: 0;
      background: white;
      cursor: pointer;
    }

    @media (min-width: 1024px) {
      :host {
        background-color: #f9fafb;
      }

      .activity-panel-heading {
        display: block;
      }

      .activity-log {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 0.5rem;
      }

      .activity-log-message {
        background-color: #e5e7eb;
        color: #4b5563;
        letter-spacing: 0.1px;
        text-align: center;
      }

      .activity-chat {
        margin-bottom: 0.75rem;
        padding: 0 0.5rem;
      }

      .activity-chat-wrapper {
        padding: 0;
        background-color: transparent;
        border-radius: 0;
      }

      .activity-chat-name {
        color: #1f2937;
        font-weight: 600;
      }

      .activity-chat-message {
        color: #1f2937;
      }

      .activity-panel-list {
        height: 100%;
      }

      .button-submit {
        right: 1.5rem;
      }
    }
  `;

  static properties = {
    token: { type: String },
    templates: { type: Array },
    streamId: { type: Number },
    chatForm: { type: String }
  };

  constructor() {
    super();
    /** @type {string} */
    this.token = '';
    /** @type {any} */
    this.templates = [];
    /** @type {number | undefined} */
    this.streamId = undefined;
    /** @type {string} */
    this.chatForm = '';
  }

  connectedCallback() {
    super.connectedCallback();

    const baseUrl = 'https://channel.inlive.app';
    const subscribeUrl = `${baseUrl}/subscribe/${this.streamId}`;
    const eventSource = new EventSource(subscribeUrl);

    eventSource.addEventListener('message', (event) => {
      if (event?.data) {
        const data = JSON.parse(event.data);
        const messageData = data.message;
        console.log('event source data', data);

        if (data.type === 'init') {
          console.log('---msk init condition---');
          this.token = messageData?.token;
          console.log('token', this.token);
          this.getAllMessages();
        } else if (messageData) {
          if (Array.isArray(messageData)) {
            console.log('---msk message data array condition---');
            console.log('messageData', messageData);
            const filteredMessages = messageData.filter((messageItem) => {
              const { message } = messageItem;
              return message && message.type === 'chat';
            });

            console.log('filtered message', filteredMessages);
            for (const filteredItem of filteredMessages) {
              const { message } = filteredItem;

              if (message) {
                const { username, messageText } = message;
                const chatMessage = this.createChatMessage(
                  username,
                  messageText
                );

                if (chatMessage) {
                  console.log('msk siniiiiii--chatmessage');
                  this.templates = [...this.templates, chatMessage];
                }
              }
            }
          } else if (
            data.type === 'system' &&
            (data.message.status === 'join' || data.message.status === 'leave')
          ) {
            const username = localStorage.getItem('viewer-username');
            const templateToAppend = html`
              <li class="activity-log">
                <p class="activity-log-message">
                  ${username} ${data.message.status}
                </p>
              </li>
            `;

            this.templates = [...this.templates, templateToAppend];
          } else {
            const { username, messageText } = messageData;
            const chatMessage = this.createChatMessage(username, messageText);
            console.log('chat message', chatMessage);

            if (chatMessage) {
              this.templates = [...this.templates, chatMessage];
            }
          }

          const bodyElement = this.renderRoot.querySelector(
            '.activity-panel-list'
          );
          console.log('body el', bodyElement);
          if (bodyElement) {
            console.log('---msk sini body el---');
            this.scrollToBottom(bodyElement);
          }
        }
      }
    });

    eventSource.addEventListener('error', (event) => {
      if (eventSource.readyState === EventSource.CLOSED) {
        console.log('Connection was closed');
      }
      console.log(event);
    });
  }

  /**
   * @param {string} username username
   * @param {string} messageText chat text
   * @returns {any} html
   */
  createChatMessage(username, messageText) {
    if (username && messageText) {
      const templateToAppend = html`
        <li class="activity-chat">
          <div class="activity-chat-wrapper">
            <strong class="activity-chat-name">${username}:</strong>
            <p class="activity-chat-message">${messageText}</p>
          </div>
        </li>
      `;
      return templateToAppend;
    }
  }

  async getAllMessages() {
    const getAllMessageBody = {
      type: 'request',
      // widget key prop needs to be snake case as example
      widgetKey: ''
    };

    const baseUrl = 'https://channel.inlive.app';
    const getAllMessageURL = `${baseUrl}/publish/${this.streamId}?token=${this.token}`;
    const data = await fetchHttp({
      url: getAllMessageURL,
      method: 'POST',
      body: getAllMessageBody
    });

    console.log('fecth all message', data);

    if (data.code !== 200) {
      alert(data.message);
    }
  }

  /**
   * @param {{ scrollTop: any; clientHeight: any; scrollHeight: any; }} element element
   */
  scrollToBottom(element) {
    if (element) {
      const autoScroll =
        element.scrollTop + element.clientHeight !== element.scrollHeight;

      console.log('1', element.scrollTop);
      console.log('2', element.clientHeight);
      console.log('3', element.scrollHeight);
      console.log('autoScroll', autoScroll);
      if (autoScroll) {
        element.scrollTop = element.scrollHeight;
      }
    }
  }

  /**
   * @param {{ preventDefault: () => void; target: any; }} event event
   */
  async handleSubmitChat(event) {
    event.preventDefault();
    const form = event.target;
    const username = localStorage.getItem('viewer-username');
    const message = form['message'].value;

    const sendMessageBody = {
      message: {
        username: username,
        type: 'chat',
        messageText: message
      },
      // widget key prop needs to be snake case as example
      widgetKey: '',
      type: 'broadcast'
    };

    const baseUrl = 'https://channel.inlive.app';
    const sendMessageUrl = `${baseUrl}/publish/${this.streamId}?token=${this.token}`;
    const data = await fetchHttp({
      url: sendMessageUrl,
      method: 'POST',
      body: sendMessageBody
    });

    console.log('submit hsl', data);

    if (data.code !== 200) {
      alert(data.message);
    } else {
      form['message'].value = '';
    }
  }

  render() {
    return html`
      <div class="activity-panel-heading">Stream Activity</div>
      <div class="activity-panel-body">
        <ul class="activity-panel-list">
          ${this.templates}
        </ul>
      </div>

      ${this.chatForm === 'hasForm'
        ? html`<form
            id="form"
            class="activity-panel-footer"
            @submit=${this.handleSubmitChat}
          >
            <input
              id="message"
              type="text"
              placeholder="Type chat here..."
              required
              class="form-input-field"
            />
            <button type="submit" class="button-submit">
              <svg
                width="21"
                height="20"
                viewBox="0 0 21 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.47794 0.405167C1.34808 0.367507 1.21045 0.365654 1.07963 0.399802C0.948799 0.43395 0.829637 0.50283 0.734749 0.599152C0.639861 0.695474 0.572777 0.815657 0.540596 0.946981C0.508415 1.07831 0.512333 1.21589 0.551937 1.34517L2.98394 9.25017H11.4999C11.6988 9.25017 11.8896 9.32918 12.0303 9.46984C12.1709 9.61049 12.2499 9.80125 12.2499 10.0002C12.2499 10.1991 12.1709 10.3898 12.0303 10.5305C11.8896 10.6711 11.6988 10.7502 11.4999 10.7502H2.98394L0.551937 18.6552C0.512333 18.7844 0.508415 18.922 0.540596 19.0534C0.572777 19.1847 0.639861 19.3049 0.734749 19.4012C0.829637 19.4975 0.948799 19.5664 1.07963 19.6005C1.21045 19.6347 1.34808 19.6328 1.47794 19.5952C8.0929 17.6715 14.3309 14.6325 19.9229 10.6092C20.0196 10.5397 20.0983 10.4483 20.1526 10.3424C20.2069 10.2365 20.2352 10.1192 20.2352 10.0002C20.2352 9.88116 20.2069 9.76387 20.1526 9.65797C20.0983 9.55208 20.0196 9.46062 19.9229 9.39117C14.3309 5.36782 8.09292 2.32881 1.47794 0.405167Z"
                  fill="#9CA3AF"
                />
              </svg>
            </button>
          </form>`
        : undefined}
    `;
  }
}

customElements.define('app-activity-panel', AppActivityPanel);
