import {
  LitElement, html, css, customElement, property, TemplateResult,
} from 'lit-element';
import Textarena from '../Textarena';
import ArenaPlugin from '../interfaces/ArenaPlugin';
import ArenaSelection from '../helpers/ArenaSelection';
import ArenaInline from '../interfaces/ArenaInline';

@customElement('arena-link')
export class Link extends LitElement {
  @property({ type: String })
  href = '';

  static styles = css`
    :host {
      text-decoration: underline;
      position: relative;
    }
    .preview {
      display: none;
      bottom: 1rem;
      position: absolute;
      color: #ccc;
      box-shadow: 0 8px 23px -6px rgba(21, 40, 54, 0.31), 22px -14px 34px -18px rgba(33, 48, 73, 0.26);
      border-radius: 4px;
      background-color: #333;
      padding: 0 .5rem;
      border-radius: .3rem;
    }
    :host(:hover) .preview {
      display: block;
    }
  `;

  constructor() {
    super();
    this.addEventListener('click', this.onClick);
  }

  onClick(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
  }

  disconnectedCallback(): void {
    this.removeEventListener('click', this.onClick);
  }

  // Render element DOM by returning a `lit-html` template.
  render(): TemplateResult {
    return html`
    <div class="preview">${this.href}</div>
    <span><slot></slot></span>`;
  }
}

type MarkOptions = {
  tag: string,
  attributes: string[],
};

type LinkOptions = {
  name: string,
  icon: string,
  title: string,
  tag: string,
  attributes: string[];
  shortcut: string,
  hint: string,
  command: string,
  marks: MarkOptions[],
};

const defaultOptions: LinkOptions = {
  name: 'link',
  icon: '🔗',
  title: 'Link',
  // tag: 'ARENA-LINK',
  tag: 'A',
  attributes: [],
  shortcut: 'Alt + KeyK',
  hint: 'k',
  command: 'add-link',
  marks: [
    {
      tag: 'A',
      attributes: [],
    },
    // {
    //   tag: 'ARENA-LINK',
    //   attributes: [],
    // },
  ],
};

const linkPlugin = (opts?: typeof defaultOptions): ArenaPlugin => ({
  register(textarena: Textarena): void {
    const {
      name, icon, title, tag, attributes, shortcut, hint, command, marks,
    } = { ...defaultOptions, ...(opts || {}) };
    const arena = textarena.registerArena(
      {
        name,
        tag,
        attributes,
        inline: true,
      },
      marks,
    );
    textarena.registerCommand(
      command,
      (ta: Textarena, selection: ArenaSelection) => {
        // eslint-disable-next-line no-alert
        const oldNode = ta.getInlineNode(selection, arena as ArenaInline);
        let link = '';
        if (oldNode) {
          link = oldNode.getAttribute('href');
        }
        // eslint-disable-next-line no-alert
        const input = prompt('You link', link);
        if (input === null) {
          return selection;
        }
        link = input;
        if (link) {
          selection.trim();
          if (oldNode) {
            ta.updateInlineNode(selection, oldNode);
            oldNode.setAttribute('href', link);
          } else {
            const node = ta.addInlineNode(selection, arena as ArenaInline);
            if (node) {
              node.setAttribute('href', link);
            }
          }
        } else if (oldNode) {
          ta.removeInlineNode(selection, oldNode);
        }
        return selection;
      },
    );
    textarena.registerShortcut(
      shortcut,
      command,
    );
    textarena.registerTool({
      name,
      icon,
      title,
      command,
      hint,
      shortcut,
    });
  },
});

export default linkPlugin;
