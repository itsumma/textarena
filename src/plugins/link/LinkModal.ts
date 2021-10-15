import {
  css, html, LitElement, property, PropertyValues, TemplateResult,
} from 'lit-element';

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
    left: calc(50% - 150px);
    box-shadow: 0 0 1em 0.1em rgb(32 68 122 / 28%);
    border: none;
    background-color: #eee;
    width: 300px;
    border-radius: 5px;
  }
  .content.showed {
    opacity: 1;
    animation-name: slideIn;
    animation-duration: 0.4s;
    top: 100px;
  }
  /* Close button */
  .close {
    color: #aaa;
    float: left;
    font-size: 28px;
    font-weight: bold;
    position: relative;
    left: 5px;
  }
  .close:hover,
  .clsoe:focus {
    color: #000;
    text-decoration: none;
    cursor: pointer;    
  }
  .title {
    margin: 0;
    text-align: center;
  }
  .body {
    padding: 0px 20px 25px;
  }
  .header {
    background: #fff;
    padding: 5px 10px;
    border-radius: 5px 5px 0 0;
  }
  .label {
    margin-top: 10px;
  }
  input {
    width: 100%;
    font-size: 0.7rem;
    padding: 8px;
    font-family: inherit;
    box-sizing: border-box;
    border: none;
    border-radius: 5px;
    color: #333;
  }
  input:focus, .footer button:focus { 
    outline: none !important;
    border-color: #20447a;
    box-shadow: 0 0 0.3em rgb(32 68 122 / 58%);
  }
  .footer {
    background: #fff;
    text-align: center;
    border-radius: 0 0 5px 5px;
  }
  .footer button {
    font-family: inherit;
    font-weight: bold;
    background: #fff;
    width: 100%;
    display: block;
    box-sizing: border-box;
    padding: 10px;
    border: none;
    border-radius: 0 0 5px 5px;
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
            <div class="header">
                <span class="close" @click="${this.onClose}">&times;</span>
                <h3 class="title">URL</h3>
            </div>
            <div class="body">
                <div class="label">
                    <label for="text">Текст</label>
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
    this.show = false;
  }

  onClose(): void {
    this.show = false;
    if (this.closeCB) {
      this.closeCB();
    }
  }
}
