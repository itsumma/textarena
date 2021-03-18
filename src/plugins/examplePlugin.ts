import {
  LitElement, html, css, customElement, property, TemplateResult,
} from 'lit-element';
import Textarena from '../Textarena';
import ArenaPlugin from '../interfaces/ArenaPlugin';
import ArenaSelection from '../helpers/ArenaSelection';

@customElement('arena-recomendation')
export class Callout extends LitElement {
  protected currentPostId = '';

  @property({
    type: String,
    reflect: true,
  })
  set postId(value: string) {
    this.currentPostId = value;
    this.fetchPost(value);
  }

  get postId(): string {
    return this.currentPostId;
  }

  currentContent = '';

  inputValue = '';

  loading = false;

  static styles = css`
    :host {
      background: lightgray;
      border: 1px solid red;
      display: block;
      padding: 1em;
      margin: 0 0 1em;
      user-select: none;
    }`;

  constructor() {
    super();
    this.addEventListener('keydown', this.handleEvent);
    this.addEventListener('input', this.handleEvent);
    this.addEventListener('mouseup', this.handleEvent);
    this.addEventListener('keyup', this.handleEvent);
    this.addEventListener('keypress', this.handleEvent);
    this.addEventListener('keydown', this.handleEvent);
    this.addEventListener('paste', this.handleEvent);
    this.addEventListener('selectionchange', this.handleEvent);
    if (this.postId) {
      this.fetchPost(this.postId);
    }
  }

  disconnectedCallback(): void {
    this.removeEventListener('keydown', this.handleEvent);
    this.removeEventListener('input', this.handleEvent);
    this.removeEventListener('mouseup', this.handleEvent);
    this.removeEventListener('keyup', this.handleEvent);
    this.removeEventListener('keypress', this.handleEvent);
    this.removeEventListener('keydown', this.handleEvent);
    this.removeEventListener('paste', this.handleEvent);
    this.removeEventListener('selectionchange', this.handleEvent);
  }

  fetchPost(postId: string): void {
    if (!postId) {
      this.loading = false;
      this.currentContent = '';
      this.requestUpdate();
      return;
    }
    // fetch from api
    this.loading = true;
    this.currentContent = '';
    this.requestUpdate();
    setTimeout(() => {
      if (postId === this.postId) {
        this.currentContent = `Статья «${postId}»`;
        this.loading = false;
        this.requestUpdate();
      }
    }, 2000);
  }

  createRenderRoot(): ShadowRoot {
    return this.attachShadow({
      mode: 'closed',
      // delegatesFocus: true,
    });
  }

  handleEvent(event: Event): void {
    // Prevent event from ArenaBrowser
    event.stopPropagation();
  }

  handleClick(): void {
    if (this.inputValue) {
      // this.postId = this.inputValue;
      this.fireChangeAttribute('postid', this.inputValue);
      // this.requestUpdate();
      // this.fetchPost(this.postId);
    }
  }

  fireChangeAttribute(name: string, value: string): void {
    const event = new CustomEvent('arena-change-attribute', {
      bubbles: true,
      detail: {
        name,
        value,
        target: this,
      },
    });
    this.dispatchEvent(event);
  }

  handleInput(e: InputEvent): void {
    if (!e.currentTarget) {
      return;
    }
    const { value } = e.currentTarget as HTMLInputElement;
    this.inputValue = value;
  }

  // Render element DOM by returning a `lit-html` template.
  render(): TemplateResult {
    if (this.loading) {
      return html`<div>
        Грузится…
      </div>`;
    }
    let content;
    if (this.postId) {
      content = html`<div>
        <div>Вам рекомендуется почитать:</div>
        ${this.currentContent}
      </div>`;
    } else {
      content = html`<div>
        <input type="text" @input="${this.handleInput}" />
        <input type="button" @click="${this.handleClick}" value="Ок" />
      </div>`;
    }

    return html`<div>
      ${content}
    </div>`;
  }
}

const examplePlugin = (options?: any): ArenaPlugin => ({
  register: (ta: Textarena) => {
    const arena = ta.registerArena(
      {
        name: 'exampleRecomendation',
        tag: 'ARENA-RECOMENDATION',
        attributes: [
        ],
        allowedAttributes: ['postid'],
        single: true,
      },
      [
        {
          tag: 'ARENA-RECOMENDATION',
          attributes: [],
        },
      ],
      [ta.getRootArenaName()],
    );
    ta.registerCommand(
      'add-recomendation',
      (someTa: Textarena, selection: ArenaSelection) => {
        const sel = someTa.transformModel(selection, arena);
        return sel;
      },
    );

    ta.registerShortcut(
      'Alt + KeyR',
      'add-recomendation',
    );
    ta.registerCreator({
      name: 'exampleRecomendation',
      icon: '👍',
      title: 'Example recomendation',
      shortcut: 'Alt + KeyR',
      hint: 'r',
      command: 'add-recomendation',
    });
  },
});

export default examplePlugin;
