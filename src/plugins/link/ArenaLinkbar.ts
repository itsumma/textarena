import {
  css, html, LitElement, TemplateResult,
} from 'lit';
import { property } from 'lit/decorators.js';

import { ElementHelper } from '../../helpers';
import { ArenaNodeInline, ArenaNodeText } from '../../interfaces';
import Textarena from '../../Textarena';

export class ArenaLinkbar extends LitElement {
  static styles = css`
    :host {
      display: flex;
      position: absolute;
      z-index: 1;
      /* font-size: 0.8em; */
      pointer-events: none;
    }
    .preview {
      z-index: 2;
      padding: 0.2em;
      flex-wrap: wrap;
      color: #4a4a4a;
      box-shadow: 0 8px 23px -6px rgba(21, 40, 54, 0.31), 22px -14px 34px -18px rgba(33, 48, 73, 0.26);
      border-radius: 0.3em;
      pointer-events: all;
      user-select: none;
      max-width: 100%;
      background-color: rgb(231, 231, 231);
    }
    @supports ((-webkit-backdrop-filter: none) or (backdrop-filter: none)) {
      .preview {
        background-color: #dadada8f;
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
      }
    }
    .link {
      display: flex;
      justify-content: space-between;
    }
    .link > a {
      font-size: 0.8em;
      padding: 0 0.2em;
      max-width: 13em;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    a,
    a:focus,
    a:active,
    a:visited {
      color: inherit;
      text-decoration: underline;
    }
    a:hover {
      background: white;
      color: black;
      border-radius: 0.3em;
    }
    button {
      display: flex;
      justify-content: center;
      align-items: center;
      box-sizing: border-box;
      height: 1.4em;
      margin-left: 0.3em;
      padding: 0.2em;
      white-space: nowrap;
      background: none;
      border: none;
      font-size: inherit;
      color: inherit;
      outline: none;
      cursor: pointer;
    }
    button > svg {
      max-width: 1em;
    }
    button:hover {
      background: white;
      color: black;
      border-radius: 0.3em;
    }
    button:active {
      color: #fff;
      box-shadow: inset -0.05em -0.05em 0 0 rgb(255 255 255 / 40%);
      background: #1a1a1a;
    }
    button > span {
      font-size: 0.7em;
    }
  `;

  @property({ type: Boolean })
    show: boolean | undefined;

  @property({ type: Object })
    node: ArenaNodeInline | undefined;

  @property({ type: Object })
    parent: ArenaNodeText | undefined;

  @property({ type: Number })
    centerposition: number | undefined;

  @property({ type: Object })
    textarena: Textarena | undefined;

  @property({ type: Object })
    linkModal: ElementHelper | undefined;

  @property({ type: String })
    commandName: string | undefined;

  render(): TemplateResult | undefined {
    if (this.node && this.show) {
      const href = this.node.getAttribute('href') as string;
      const isBlank = this.node.getAttribute('target') === '_blank';
      return html`
      <div class="preview">
        <div class="link">
          <a href="${href}" target="_blank">${href}</a>
          <button @click="${this.handleEdit}">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><path d="M0 0h24v24H0z" fill="none"/><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
          </button>
          ${typeof navigator?.clipboard?.writeText === 'function' ? html`
            <button @click="${this.handleCopy}">
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><path d="M0 0h24v24H0z" fill="none"/><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
            </button>
          ` : ''}

          <button @click="${this.handleRemove}">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M17 7h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1 0 1.43-.98 2.63-2.31 2.98l1.46 1.46C20.88 15.61 22 13.95 22 12c0-2.76-2.24-5-5-5zm-1 4h-2.19l2 2H16zM2 4.27l3.11 3.11C3.29 8.12 2 9.91 2 12c0 2.76 2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1 0-1.59 1.21-2.9 2.76-3.07L8.73 11H8v2h2.73L13 15.27V17h1.73l4.01 4L20 19.74 3.27 3 2 4.27z"/><path d="M0 24V0" fill="none"/></svg>
          </button>
          <button @click="${this.handleBlank}">
            ${isBlank ? html`<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><path d="M0 0h24v24H0z" fill="none"/><path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>`
    : html`<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><path d="M0 0h24v24H0z" fill="none"/><path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/></svg>`}
            <span>&nbsp;В новом окне</span>
          </button>
        </div>

      </div>`;
    }
    return undefined;
  }

  handleBlank(): void {
    if (this.node) {
      const isBlank = this.node.getAttribute('target') === '_blank';
      this.node.setAttribute('target', isBlank ? undefined : '_blank');
      (this.textarena as Textarena).fire('modelChanged');
      this.requestUpdate();
    }
  }

  handleCopy(): void {
    if (this.node) {
      const href = this.node.getAttribute('href');
      if (typeof href === 'string' && href) {
        navigator.clipboard.writeText(href);
      }
    }
  }

  handleEdit(): void {
    const selection = this.textarena?.getCurrentSelection();
    if (!selection || !this.commandName) return;
    this.textarena?.execCommand(this.commandName, selection);
  }

  handleRemove(): void {
    if (this.parent && this.node) {
      this.parent.removeInlineNode(this.node);
      (this.textarena as Textarena).fire('modelChanged', {});
      this.requestUpdate();
    }
  }
}
