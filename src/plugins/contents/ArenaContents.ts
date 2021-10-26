import {
  html, css, TemplateResult,
} from 'lit';
import { property } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import WebComponent from '../../helpers/WebComponent';
import { AnyArenaNode } from '../../interfaces/ArenaNode';
import { ContentItem, Contents, ContentsComponentProcessor } from './types';

export default class ArenaContents extends WebComponent {
  @property({ type: String })
    list: string | undefined;

  @property({
    type: Object,
  })
    node: AnyArenaNode | undefined;

  static styles = css`
    :host {
      display: block;
      padding: 1rem;
      overflow: hidden;
      border: 1px solid #ccc;
      border-radius: 1rem;
    }
    h3 {
      line-height: 1.2em;
      min-height: 1.2em;
      margin: 0 0 0.5em;
      padding: 0;
      font-size: 1em;
    }
    ul {
      list-style: none;
      margin: 0;
      padding: 0;
    }
    li {
      margin-bottom: 0.7em;
    }
    .row {
      display: flex;
      align-items: center;
    }
    .input-title {
      flex: 1;
      margin: 0 1em;
      font-size: 1em;
      font-family: inherit;
    }
    a,
    a:focus,
    a:active,
    a:hover {
      text-decoration: none;
    }
    .original {
      font-size: 0.7em;
    }
    .reset {
      font-size: 0.7em;
    }
    `;

  render(): TemplateResult {
    const data = this.node?.getAttribute('data') as Contents || [];
    return html`
      <h3>
        Содержание <button type="button" @click="${this.handleClick}" >Обновить</button>
      </h3>
      <ul>
        ${repeat(data, (c) => c.id, (c) => html`
          <li>
            <div class="row">
              <input
                type="checkbox"
                ?checked="${c.active}"
                @change="${this.handleToggle(c)}" />
              <input
                class="input-title"
                type="text"
                value="${c.title || c.originalTitle}"
                @change="${this.handleInput(c)}" />
              <a href="#${c.slug}">🔗</a>
            </div>
            ${c.title !== undefined ? html`
              <div class="original">
                Оригинал заголовка: «${c.originalTitle}»
                <button
                  type="button"
                  class="reset"
                  @click="${this.handleResetTitle(c)}"
                >Вернуть</button>
              </div>
            ` : ''}
          </li>
        `)}
      </ul>
    `;
  }

  updated() {
    this.fireCustomEvent('contentResize');
  }

  handleToggle(c: ContentItem) {
    return (e: Event): void => {
      const event = e as unknown as { path: HTMLInputElement[] };
      // eslint-disable-next-line no-param-reassign
      c.active = event.path[0].checked;
      this.updateList();
    };
  }

  handleInput(c: ContentItem) {
    return (e: Event): void => {
      const event = e as unknown as { path: HTMLInputElement[] };
      const title = event.path[0].value;
      if (title === c.originalTitle) {
        // eslint-disable-next-line no-param-reassign
        c.title = undefined;
      } else {
        // eslint-disable-next-line no-param-reassign
        c.title = title;
      }
      this.updateList();
    };
  }

  handleClick(e: Event): void {
    e.preventDefault();
    if (this.node) {
      const processor = this.node.arena.getAttribute('processor') as ContentsComponentProcessor;
      if (processor) {
        processor(this.node);
        this.updateList();
        this.requestUpdate();
      }
    }
  }

  handleResetTitle(c: ContentItem) {
    return (): void => {
      // eslint-disable-next-line no-param-reassign
      c.title = undefined;
      this.updateList();
      this.requestUpdate();
    };
  }

  updateList(): void {
    const data = this.node?.getAttribute('data') as Contents || [];
    this.fireChangeAttribute({
      list: JSON.stringify(data.map(({ slug, title, active }) => ({ slug, title, active }))),
    });
  }
}
