import { html, css, LitElement } from 'lit';
import { InliveEvent } from '@inlivedev/inlive-js-sdk/event';
import './app-action-panel.js';
import './app-video-panel.js';
import './app-information-panel.js';
import '../../shared/ui/app-activity-panel.js';
import { fetchHttp } from '../../shared/modules/fetch-http.js';

/**
 * @typedef {'preparing' | 'connecting' | 'ready' | 'live' | 'end'} StreamStatusType
 */

export class AppStudio extends LitElement {
  static styles = css`
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    .main-panel {
      position: relative;
      min-height: 100vh;
      background-color: #000;
      color: #fff;
      display: grid;
      grid-template-areas:
        'information-panel'
        'action-panel'
        '.'
        'activity-panel';
      grid-template-rows: max-content max-content auto max-content;
      grid-template-columns: 1fr;
    }

    .video-panel {
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      grid-area: video-panel;
    }

    .information-panel {
      position: relative;
      margin-top: 3rem;
      grid-area: information-panel;
    }

    .action-panel {
      margin-top: 1rem;
      position: relative;
      grid-area: action-panel;
    }

    .activity-panel {
      position: relative;
      grid-area: activity-panel;
    }

    .action-panel-container {
      padding-left: 1rem;
      padding-right: 1rem;
    }

    @media (min-width: 1024px) {
      .main-panel {
        background-color: #fff;
        color: #000;
        grid-template-areas:
          'video-panel action-panel'
          'video-panel activity-panel'
          'information-panel activity-panel';
        grid-template-columns: auto 20rem;
        grid-template-rows: 4.625rem max-content auto;
      }

      .video-panel {
        position: unset;
        top: unset;
        left: unset;
        width: auto;
        height: auto;
        padding: 1.5rem 1.5rem 0 1.5rem;
      }

      .information-panel {
        margin-top: 0;
      }

      .action-panel {
        margin-top: 0;
        z-index: 10;
      }

      .action-panel-container {
        position: fixed;
        top: 0;
        right: 0;
        width: 20rem;
        padding: 1rem;
        border-left: 1px solid #d1d5db;
      }

      .activity-panel-container {
        position: fixed;
        top: 4.625rem;
        right: 0;
        width: 20rem;
        height: calc(100% - 4.625rem);
        max-height: 100vh;
        border-left: 1px solid #d1d5db;
      }
    }

    @media (min-width: 1280px) {
      .main-panel {
        grid-template-columns: auto 23rem;
      }

      .action-panel-container,
      .activity-panel-container {
        width: 23rem;
      }
    }
  `;

  static properties = {
    heading: { type: String },
    description: { type: String },
    streamId: { type: Number },
    startTime: { type: String },
    endTime: { type: String },
    preparedAt: { type: String },
    quality: { type: Number },
    streamStatus: { type: String },
    token: { type: String },
    templates: { type: Array },
    viewerCount: { type: Number }
  };

  constructor() {
    super();
    /** @type {string} */
    this.heading = '';
    /** @type {string} */
    this.description = '';
    /** @type {number | undefined} */
    this.streamId = undefined;
    /** @type {string} */
    this.startTime = '';
    /** @type {string} */
    this.endTime = '';
    /** @type {string} */
    this.preparedAt = '';
    /** @type {number | undefined} */
    this.quality = undefined;
    /** @type {StreamStatusType} */
    this.streamStatus = 'preparing';
    /** @type {string} */
    this.token = '';
    /** @type {any} */
    this.templates = [];
    /** @type {number} */
    this.viewerCount = 0;
  }

  connectedCallback() {
    super.connectedCallback();

    if (this.startTime && this.endTime) {
      this.streamStatus = 'end';
    } else {
      InliveEvent.subscribe('stream:ready-to-start-event', () => {
        this.streamStatus = 'ready';
      });

      InliveEvent.subscribe('stream:start-event', () => {
        this.streamStatus = 'live';
      });

      InliveEvent.subscribe('stream:end-event', () => {
        this.streamStatus = 'end';
      });
    }

    const baseUrl = 'https://channel.inlive.app';
    const subscribeUrl = `${baseUrl}/subscribe/${this.streamId}`;
    const eventSource = new EventSource(subscribeUrl);

    eventSource.addEventListener('message', (event) => {
      if (event?.data) {
        const data = JSON.parse(event.data);
        const messageData = data.message;

        if (data.type === 'init') {
          this.token = messageData?.token;
          this.getAllMessages();

          if (messageData.viewer_count) {
            this.updateViewerCounterUI(messageData.viewer_count);
          }
        } else if (messageData) {
          if (Array.isArray(messageData)) {
            const filteredMessages = messageData.filter((messageItem) => {
              const { message } = messageItem;
              return message && message.type === 'chat';
            });

            for (const filteredItem of filteredMessages) {
              const { message } = filteredItem;

              if (message) {
                const { username, messageText } = message;
                const chatMessage = this.createChatMessage(
                  username,
                  messageText
                );

                if (chatMessage) {
                  this.templates = [...this.templates, chatMessage];
                }
              }
            }
          } else if (
            data.type === 'system' &&
            (data.message.status === 'join' || data.message.status === 'leave')
          ) {
            // username for steamer to detect viewer still hardcode
            const username = 'a user';
            const templateToAppend = html`
              <li class="activity-log">
                <p class="activity-log-message">
                  ${username} ${data.message.status}
                </p>
              </li>
            `;

            this.templates = [...this.templates, templateToAppend];

            if (messageData.viewer_count) {
              this.updateViewerCounterUI(messageData.viewer_count);
            }
          } else {
            const { username, messageText } = messageData;
            const chatMessage = this.createChatMessage(username, messageText);

            if (chatMessage) {
              this.templates = [...this.templates, chatMessage];
            }
          }

          const bodyElement = this.renderRoot
            .querySelector('app-activity-panel')
            ?.shadowRoot?.querySelector('.activity-panel-list');
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

      if (autoScroll) {
        element.scrollTop = element.scrollHeight;
      }
    }
  }

  /**
   * @param {number} counter viewer quantity
   */
  updateViewerCounterUI(counter) {
    if (typeof counter === 'number') {
      this.viewerCount = counter;
    }
  }

  render() {
    return html`
      <div class="main-panel">
        <div class="video-panel">
          <app-video-panel
            streamId=${this.streamId}
            startTime=${this.startTime}
            endTime=${this.endTime}
            preparedAt=${this.preparedAt}
            streamStatus=${this.streamStatus}
          ></app-video-panel>
        </div>
        <div class="information-panel">
          <app-information-panel
            heading=${this.heading}
            description=${this.description}
            streamStatus=${this.streamStatus}
            viewerCount=${this.viewerCount}
          ></app-information-panel>
        </div>
        <div class="action-panel">
          <div class="action-panel-container">
            <app-action-panel
              streamId=${this.streamId}
              streamStatus=${this.streamStatus}
            ></app-action-panel>
          </div>
        </div>
        <div class="activity-panel">
          <div class="activity-panel-container">
            <app-activity-panel
              token=${this.token}
              .templates=${this.templates}
              streamId=${this.streamId}
              chatForm="noForm"
            ></app-activity-panel>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('app-studio', AppStudio);
