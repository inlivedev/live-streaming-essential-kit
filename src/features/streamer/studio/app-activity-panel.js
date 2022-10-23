import { css, html, LitElement } from 'lit';

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

  render() {
    return html`
      <div class="activity-panel-heading">Stream Activity</div>
      <div class="activity-panel-body">
        <ul class="activity-panel-list">
          <li class="activity-log">
            <p class="activity-log-message">luffy joined</p>
          </li>
          <li class="activity-log">
            <p class="activity-log-message">zoro joined</p>
          </li>
          <li class="activity-chat">
            <div class="activity-chat-wrapper">
              <strong class="activity-chat-name">luffy:</strong>
              <p class="activity-chat-message">seru banget!!!</p>
            </div>
          </li>
          <li class="activity-log">
            <p class="activity-log-message">zoro joined</p>
          </li>
          <li class="activity-chat">
            <div class="activity-chat-wrapper">
              <strong class="activity-chat-name">luffy:</strong>
              <p class="activity-chat-message">seru banget!!!</p>
            </div>
          </li>
        </ul>
      </div>
      <div class="activity-panel-footer"></div>
    `;
  }
}

customElements.define('app-activity-panel', AppActivityPanel);
