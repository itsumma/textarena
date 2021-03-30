import Textarena from '../Textarena';
import ArenaPlugin from '../interfaces/ArenaPlugin';
import ArenaSelection from '../helpers/ArenaSelection';
import { ArenaInlineInterface } from '../interfaces/Arena';

// @customElement('arena-link')
// export class Link extends LitElement {
//   @property({ type: String })
//   href = '';

//   static styles = css`
//     :host {
//       text-decoration: underline;
//       position: relative;
//     }
//     .preview {
//       display: none;
//       bottom: 1rem;
//       position: absolute;
//       color: #ccc;
//       box-shadow: 0 8px 23px -6px rgba(21, 40, 54, 0.31),
//                  22px -14px 34px -18px rgba(33, 48, 73, 0.26);
//       border-radius: 4px;
//       background-color: #333;
//       padding: 0 .5rem;
//       border-radius: .3rem;
//     }
//     :host(:hover) .preview {
//       display: block;
//     }
//   `;

//   constructor() {
//     super();
//     this.addEventListener('click', this.onClick);
//   }

//   onClick(event: Event): void {
//     event.preventDefault();
//     event.stopPropagation();
//   }

//   disconnectedCallback(): void {
//     this.removeEventListener('click', this.onClick);
//   }

//   // Render element DOM by returning a `lit-html` template.
//   render(): TemplateResult {
//     return html`
//     <div class="preview">${this.href}</div>
//     <span><slot></slot></span>`;
//   }
// }

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
  allowedAttributes: string[];
  shortcut: string,
  hint: string,
  command: string,
  marks: MarkOptions[],
};

const defaultOptions: LinkOptions = {
  name: 'link',
  icon: `<svg width="20px" height="10px" viewBox="0 0 20 10" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <g id="Icons" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
      <g id="Rounded" transform="translate(-748.000000, -2065.000000)">
          <g id="Editor" transform="translate(100.000000, 1960.000000)">
              <g id="-Round-/-Editor-/-insert_link" transform="translate(646.000000, 98.000000)">
                  <g>
                      <polygon id="Path" points="0 0 24 0 24 24 0 24"></polygon>
                      <path d="M3.96,11.38 C4.24,9.91 5.62,8.9 7.12,8.9 L10.05,8.9 C10.57,8.9 11,8.47 11,7.95 C11,7.43 10.57,7 10.05,7 L7.22,7 C4.61,7 2.28,8.91 2.03,11.51 C1.74,14.49 4.08,17 7,17 L10.05,17 C10.57,17 11,16.57 11,16.05 C11,15.53 10.57,15.1 10.05,15.1 L7,15.1 C5.09,15.1 3.58,13.36 3.96,11.38 Z M9,13 L15,13 C15.55,13 16,12.55 16,12 C16,11.45 15.55,11 15,11 L9,11 C8.45,11 8,11.45 8,12 C8,12.55 8.45,13 9,13 Z M16.78,7 L13.95,7 C13.43,7 13,7.43 13,7.95 C13,8.47 13.43,8.9 13.95,8.9 L16.88,8.9 C18.38,8.9 19.76,9.91 20.04,11.38 C20.42,13.36 18.91,15.1 17,15.1 L13.95,15.1 C13.43,15.1 13,15.53 13,16.05 C13,16.57 13.43,17 13.95,17 L17,17 C19.92,17 22.26,14.49 21.98,11.51 C21.73,8.91 19.39,7 16.78,7 Z" id="🔹-Icon-Color" fill="currentColor"></path>
                  </g>
              </g>
          </g>
      </g>
  </g>
</svg>`,
  title: 'Link',
  // tag: 'ARENA-LINK',
  tag: 'A',
  attributes: [],
  allowedAttributes: ['href'],
  shortcut: 'Ctrl + KeyK',
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
      name, icon, title, tag, attributes, allowedAttributes, shortcut, hint, command, marks,
    } = { ...defaultOptions, ...(opts || {}) };
    const arena = textarena.registerArena(
      {
        name,
        tag,
        attributes,
        allowedAttributes,
        inline: true,
      },
      marks,
    ) as ArenaInlineInterface;
    textarena.registerCommand(
      command,
      (ta: Textarena, selection: ArenaSelection) => {
        // eslint-disable-next-line no-alert
        const oldNode = ta.getInlineNode(selection, arena);
        let link = '';
        if (oldNode) {
          link = oldNode.getAttribute('href').toString();
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
            const node = ta.addInlineNode(selection, arena);
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
