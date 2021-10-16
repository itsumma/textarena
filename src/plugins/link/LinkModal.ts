import {
  LitElement, css, TemplateResult, html, PropertyValues,
} from 'lit';
import { property } from 'lit/decorators.js';

export default class LinkModal extends LitElement {
  static styles = css`
  .wrapper {
    opacity: 0;
    display: none; /* Hidden by default */
    position: fixed; /* Stay in place */
    z-index: 1; /* Sit on top */
    left: 0;
    top: 0;
    overflow-y: hidden; /* Disable scroll */
    width: 100%; /* Full width */
    height: 100%; /* Full height */
    background-color: rgb(0, 0, 0); /* Fallback color */
    background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */
  }
  .wrapper.showed {
    opacity: 1;
    animation-name: fadein; /* Fade in the background */
    animation-duration: 0.4s;
    display: block; /* show wrapper */
  }
  /* Modal content */
  .content {
    opacity: 0;
    position: fixed;
    left: calc(50% - 7.5em);
    border: none;
    width: 15em;
    color: rgb(74, 74, 74);
    box-shadow: 0 8px 23px -6px rgba(21, 40, 54, 0.31), 22px -14px 34px -18px rgba(33, 48, 73, 0.26);
    border-radius: 0.3em;
    background-color: rgb(231, 231, 231);
  }
  @supports ((-webkit-backdrop-filter: none) or (backdrop-filter: none)) {
    .content {
      background-color: #ffffff96;
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
    }
  }
  .content.showed {
    opacity: 1;
    animation-name: slideIn;
    animation-duration: 0.4s;
    top: 5em;
  }
  /* Close button */
  .close {
    font-family: inherit;
    color: inherit;
    background: none;
    display: block;
    box-sizing: border-box;
    border: none;
    position: absolute;
    right: 0.2em;
    top: 0.2em;
    font-size: 1.5em;
    font-weight: bold;
    border-radius: 0.2em;
    width: 1em;
    height: 1em;
    line-height: 1.1em;
    padding: 0px;
  }
  .close:hover,
  .clsoe:focus {
    color: #000;
    text-decoration: none;
    cursor: pointer;
    background: #fff;
  }
  .title {
    margin: 0;
    text-align: center;
    line-height: 1.5em;
  }
  .body {
    padding: 1em 1em 0;
  }
  .header {
    /* background: #fff; */
    padding: 1em 1em 0;
    border-radius: 0.5em 0.5em 0 0;
  }
  .label {
    margin-top: 10px;
  }
  input {
    width: 100%;
    background-color: #ffffff7a;
    color: black;
    font-size: 0.7rem;
    padding: 8px;
    font-family: inherit;
    box-sizing: border-box;
    border: none;
    border-radius: 0.2em;
  }
  input:focus, .footer button:focus {
    outline: none !important;
    border-color: #20447a;
    box-shadow: 0 0 0.3em rgb(32 68 122 / 58%);
    background-color: #ffffff;
  }
  .footer {
    /* background: #fff; */
    text-align: center;
    border-radius: 0 0 0.5em 0.5em;
    padding: 1em;
  }
  .footer button {
    font-family: inherit;
    font-weight: bold;
    color: inherit;
    background: none;
    width: 100%;
    display: block;
    box-sizing: border-box;
    padding: 10px;
    border: none;
    border-radius: 0.2em;
    cursor: pointer;
  }
  .footer button:hover {
    background: #fff;
  }
  @keyframes fadein {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }
  @keyframes slideIn {
    from {
      top: 0px;
      opacity: 0;
    }

    to {
      top: 100px;
      opacity: 1;
    }
  }
  `;

  constructor() {
    super();
    this.text = '';
    this.url = '';
  }

  @property({ type: Function })
    saveCB: ((url: string, text: string) => void) | undefined;

  @property({ type: Function })
    closeCB: (() => void) | undefined;

  @property({ type: String })
    text: string;

  @property({ type: String })
    url: string;

  @property({ type: Boolean })
    show = false;

  protected render(): TemplateResult | undefined {
    return html`
      <div class="wrapper ${this.show ? 'showed' : ''}" @click="${this.onClose}">
        <div class="content ${this.show ? 'showed' : ''}" @click="${this.onClick}" @keydown="${this.onKeydown}">
          <button class="close" @click="${this.onClose}">&times;</button>
            <div class="body">
                <div class="label">
                    <label for="text">Text</label>
                </div>
                <input type="text" id="text" value="${this.text}" .value="${this.text}" />
                <div class="label">
                    <label for="url">URL</label>
                </div>
                <input type="text" id="url" value="${this.url}" .value="${this.url}" />
            </div>
            <div class="footer">
                <button @click="${this.onSave}">OK</button>
            </div>
        </div>
      </div>
    `;
  }

  updated(props: PropertyValues<LinkModal>): void {
    // For some reason after showing the modal updated cb receives props with show equals to false
    if (props.get('show') === false) {
      this.urlEl?.focus();
    }
  }

  private getElementById(id: string): HTMLInputElement | undefined {
    if (this.shadowRoot !== null) {
      return this.shadowRoot.getElementById(id) as HTMLInputElement || undefined;
    }
    return undefined;
  }

  private get textEl(): HTMLInputElement | undefined {
    return this.getElementById('text');
  }

  private get urlEl(): HTMLInputElement | undefined {
    return this.getElementById('url');
  }

  onKeydown(e: KeyboardEvent): void {
    switch (e.key) {
      case 'Enter':
        e.preventDefault();
        this.onSave();
        break;
      case 'Escape':
        e.preventDefault();
        this.onClose();
        break;
      default:
        break;
    }
  }

  onClick(e: Event): void {
    e.stopPropagation();
  }

  onSave(): void {
    const newHref = this.urlEl?.value;
    const newText = this.textEl?.value;
    if (!newHref && !newText) {
      return;
    }
    if (this.saveCB) {
      this.saveCB(newHref?.trim() || '', newText?.trim() || '');
    }
    this.clearFields();
    this.show = false;
  }

  onClose(): void {
    if (this.closeCB) {
      this.closeCB();
    }
    this.clearFields();
    this.show = false;
  }

  clearFields(): void {
    this.url = '';
    this.text = '';
    if (this.textEl) {
      this.textEl.value = '';
    }
    if (this.urlEl) {
      this.urlEl.value = '';
    }
    this.requestUpdate();
  }
}
