import { css, html, LitElement } from 'lit';
import { fetchHttp } from '../../shared/modules/fetch-http.js';

class AppActivityPanel extends LitElement {
  static styles = css`
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    :host {
      width: 100%;
      height: 14rem;
      display: flex;
      flex-direction: column;
      overflow-y: auto;
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

    @media (min-width: 1024px) {
      :host {
        background-color: #f9fafb;
        height: 100%;
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
    }
  `;

  static properties = {
    token: { type: String },
    templates: { type: Array },
    streamId: { type: Number }
  };

  constructor() {
    super();
    this.token = '';
    /**
     * @type {any}
     */
    this.templates = [];
    /** @type {number | undefined} */
    this.streamId = undefined;
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
            // username per users ??
            const username = 'user';
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

  render() {
    return html`
      <div class="activity-panel-heading">Stream Activity</div>
      <div class="activity-panel-body">
        <ul class="activity-panel-list">
          ${this.templates}
        </ul>
      </div>
    `;
  }
}

customElements.define('app-activity-panel', AppActivityPanel);
