import {
  css, html, LitElement, property, TemplateResult,
} from 'lit-element';
import { ArenaNodeInline, ArenaNodeText } from '../../interfaces/ArenaNode';
import Textarena from '../../Textarena';
import ElementHelper from '../../helpers/ElementHelper';

export default class ArenaLinkbar extends LitElement {
  static styles = css`
    :host {
      display: flex;
      position: absolute;
      z-index: 1;
      font-size: 0.8em;
      pointer-events: none;
    }
    .preview {
      z-index: 2;
      padding: 0.2em 0.5em;
      flex-wrap: wrap;
      color: #ccc;
      box-shadow: #1528364f 0px 8px 23px -6px, #21304942 22px -14px 34px -18px;
      border-radius: 0.1em;
      background-color: #333;
      pointer-events: all;
      user-select: none;
      max-width: 100%;
    }
    .link {
      display: flex;
    }
    .tools {
      display: flex;
      justify-content: flex-end;
    }
    a,
    a:focus,
    a:active,
    a:visited {
      color: inherit;
      text-decoration: underline;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    a:hover {
      color: white;
    }
    button {
      display: flex;
      justify-content: center;
      align-items: center;
      box-sizing: border-box;
      height: 1.6em;
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
    button:hover {
      color: white;
    }
    button:active {
      color: #fff;
      box-shadow: inset -0.05em -0.05em 0 0 rgb(255 255 255 / 40%);
      background: #1a1a1a;
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

  observer: MutationObserver;

  constructor() {
    super();
    this.observer = new MutationObserver(() => {
      const preview = this.shadowRoot?.children[0] as HTMLElement;
      if (preview && this.centerposition) {
        const previewLeft = Math.max(
          0,
          Math.min(
            this.offsetWidth - preview.offsetWidth,
            this.centerposition - preview.offsetWidth / 2,
          ),
        );
        preview.style.marginLeft = `${previewLeft}px`;
      }
    });
    if (this.shadowRoot) {
      this.observer.observe(this.shadowRoot, {
        attributes: false,
        childList: true,
        subtree: true,
        characterData: true,
      });
    }
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.observer.disconnect();
  }

  render(): TemplateResult | undefined {
    if (this.node && this.show) {
      const href = this.node.getAttribute('href');
      const isBlank = this.node.getAttribute('target') === '_blank';
      return html`
      <div class="preview">
        <div class="link">
          <a href="${href}" target="_blank">${href}</a>

        </div>
        <div class="tools">
          ${typeof navigator?.clipboard?.writeText === 'function' ? html`
            <button @click="${this.handleCopy}">
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><path d="M0 0h24v24H0z" fill="none"/><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
            </button>
          ` : ''}
          <button @click="${this.handleEdit}">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><path d="M0 0h24v24H0z" fill="none"/><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
          </button>
          <button @click="${this.handleRemove}">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M17 7h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1 0 1.43-.98 2.63-2.31 2.98l1.46 1.46C20.88 15.61 22 13.95 22 12c0-2.76-2.24-5-5-5zm-1 4h-2.19l2 2H16zM2 4.27l3.11 3.11C3.29 8.12 2 9.91 2 12c0 2.76 2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1 0-1.59 1.21-2.9 2.76-3.07L8.73 11H8v2h2.73L13 15.27V17h1.73l4.01 4L20 19.74 3.27 3 2 4.27z"/><path d="M0 24V0" fill="none"/></svg>
          </button>
          <button @click="${this.handleBlank}">
            ${isBlank ? html`<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><path d="M0 0h24v24H0z" fill="none"/><path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>`
    : html`<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><path d="M0 0h24v24H0z" fill="none"/><path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/></svg>`}
            &nbsp;В новом окне
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
    if (!this.node) return;
    const href = this.node.getAttribute('href');
    const prevHref = typeof href === 'string' ? href : '';
    this.linkModal?.setProperty('url', prevHref);
    const selection = this.textarena?.getCurrentSelection();
    const text = this.parent?.getText();
    if (text && selection) {
      const interval = text.getInlineInterval(selection.startOffset, selection.endOffset);
      if (interval) {
        const { start, end } = interval;
        this.linkModal?.setProperty('text', text.getText().slice(start, end));
      }
    }
    this.linkModal?.setProperty('show', true);
    this.linkModal?.setProperty('saveCB', (newHref: string, _text: string) => {
      if (!this.node) {
        return;
      }
      if (newHref) {
        this.node.setAttribute('href', newHref);
      } else {
        const parent = this.parent as ArenaNodeText;
        if (parent) {
          parent.removeInlineNode(this.node);
        }
      }
      (this.textarena as Textarena).fire('modelChanged');
      this.requestUpdate();
    });
  }

  handleRemove(): void {
    if (this.parent && this.node) {
      this.parent.removeInlineNode(this.node);
      (this.textarena as Textarena).fire('modelChanged');
      this.requestUpdate();
    }
  }
}
