import { css, html, LitElement } from 'lit';

class AppLozenge extends LitElement {
  static styles = css`
    :host {
      --border-radius: 0.25rem;
      --background-color: #111827;
      --color: #fff;
      --font-size: 0.875rem;
      --font-weight: 500;
      --line-height: 1.25rem;
      --padding-right: 0.75rem;
      --padding-left: 0.75rem;
      --padding-top: 0.125rem;
      --padding-bottom: 0.125rem;
      --padding: var(--padding-top) var(--padding-right) var(--padding-bottom)
        var(--padding-left);
    }

    .lozenge {
      display: inline-block;
      border-radius: var(--border-radius);
      padding: var(--padding);
      background-color: var(--background-color);
      color: var(--color);
      font-size: var(--font-size);
      font-weight: var(--font-weight);
      line-height: var(--line-height);
      font-variant-numeric: tabular-nums;
    }
  `;

  render() {
    return html`
      <div class="lozenge">
        <slot></slot>
      </div>
    `;
  }
}

customElements.define('app-lozenge', AppLozenge);
