/* eslint-disable max-classes-per-file */
import {
  LitElement, html, css, property, TemplateResult, query,
} from 'lit-element';
import { classMap } from 'lit-html/directives/class-map';
import Textarena from '../Textarena';
import ArenaPlugin from '../interfaces/ArenaPlugin';
import ArenaSelection from '../helpers/ArenaSelection';
import { ArenaNodeText } from '../interfaces/ArenaNode';
import { ArenaSingleInterface } from '../interfaces/Arena';
import ArenaAttributes from '../interfaces/ArenaAttributes';

const HOSTS = {
  twitter: ['twitter.com'],
  youtube: ['youtu.be', 'youtube.com', 'youtube-nocookie.com'],
  facebook: ['facebook.com'],
  instagram: ['instagram.com'],
};

const getProviderName = (url: URL): string | undefined => {
  const host = url.host.replace('www.', '');
  const hosts = Object.entries(HOSTS);
  for (let i = 0; i < hosts.length; i += 1) {
    if (hosts[i][1].includes(host)) {
      return hosts[i][0];
    }
  }
  return undefined;
};

const createElemEmbed = (href: string) => {
  let url: URL;
  try {
    url = new URL(href);
  } catch (e) {
    return undefined;
  }
  const name = getProviderName(url);
  if (!name) {
    return undefined;
  }
  if (name === 'youtube') {
    let src = 'https://www.youtube.com/embed/';
    const paths = url.pathname.split('/');
    if (url.host === 'youtu.be') {
      src += url.pathname;
    } else if (paths[paths.length - 2] === 'embed') {
      src += paths[paths.length - 1];
    } else if (url.searchParams.has('v')) {
      src += url.searchParams.get('v');
    }
    return {
      type: 'youtube',
      href: src,
    };
  } if (name === 'facebook') {
    const body = document.createElement('div');
    body.setAttribute('data-href', href);
    let width = '500';
    if (window.innerWidth < 720) {
      width = '300';
    } else if (window.innerHeight <= 480) {
      width = '280';
    }
    body.setAttribute('data-width', width);
    body.classList.add('fb-post');
    elem.append(body);
    return elem;
  } if (name === 'twitter') {
    const paths = url.pathname.split('/');
    if (paths[paths.length - 2] === 'status') {
      const id = paths[paths.length - 1];
      if (id) {
        return {
          type: 'twitter',
          id,
        };
      }
    }
  } else if (name === 'instagram') {
    const blockquoteElement = document.createElement('blockquote');
    blockquoteElement.setAttribute('class', 'instagram-media');
    blockquoteElement.setAttribute('data-instgrm-version', '4');
    elem.append(blockquoteElement);

    const aElement = document.createElement('a');
    aElement.setAttribute('href', href);
    blockquoteElement.append(aElement);

    return elem;
  }
  return undefined;
};

export class Embed extends LitElement {
  protected currentHref = '';

  @property({
    type: String,
  })
  type: string | undefined;

  @property({
    type: String,
  })
  postid: string | undefined;

  @property({
    type: Boolean,
  })
  border: boolean | undefined;

  @property({
    type: String,
    reflect: true,
  })
  set href(value: string) {
    this.currentHref = value;
  }

  get href(): string {
    return this.currentHref;
  }

  inputValue = '';

  static styles = css`
    :host {
      /* background: lightgray;
      border: 1px solid red;
      display: block;
      padding: 1em;
      user-select: none; */
    }
    .wrapper {
      background: white;
      border: 1px solid #ccc;
      border-radius: 1rem;
      padding: 1rem;
      margin: 0 0 1em;
    }
    .form {
      display: flex;
    }
    .form__label {
      margin-right: 1rem;
    }
    .form__input {
      border: 0;
      border-bottom: 1px solid #ccc;
      margin-right: 1rem;
      font-size: 1em;
      flex: 1;
    }
    .form__input:active,
    .form__input:focus,
    .form__input:hover {
      outline: none;
      border-color: black;
    }
    .form__btn {
      background: white;
      border: 1px solid #ccc;
      border-radius: 1rem;
      font-size: 1em;
      padding: 0.1em 1em;
    }
    .form__btn:active,
    .form__btn:focus,
    .form__btn:hover {
      outline: none;
      border-color: black;
    }
    .embed-youtube {
      width: 100%;
      padding-bottom: 56.25%;
      position: relative;
      margin: 0 0 1em;
      background: #ccc;
      overflow: hidden;
    }
    .embed-youtube_border {
      border: 1px solid #ccc;
      border-radius: .5rem;
    }
    .embed-youtube-iframe {
      width: 100%;
      height: 100%;
      margin: 0;
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      border: none;
      min-width: 100%;
      width: 0;
      max-width: 100%;
      min-height: 100%;
      height: 0;
      max-height: 100%;
    }

    .embed-youtube__toggle {
      position: absolute;
      z-index: 1;
      background: white;
      border: 1px solid #ccc;
      border-radius: 1rem;
      padding: .2rem 1rem;
      right: 1rem;
      top: 1rem;
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
    if (this.href) {
      this.fetchPost(this.href);
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

  createRenderRoot(): ShadowRoot {
    if (this.type) {
      return this;
    }
    return this.attachShadow({
      mode: 'open',
      // delegatesFocus: true,
    });
  }

  handleEvent(event: Event): void {
    // Prevent event from ArenaBrowser
    event.stopPropagation();
  }

  handleSubmit(e: Event): void {
    e.preventDefault();
    if (this.inputValue) {
      const result = createElemEmbed(this.inputValue);
      if (result) {
        if (result.type === 'twitter') {
          this.fireChangeAttribute({
            href: this.inputValue,
            type: result.type,
            postid: result.id,
          });
        } else if (result.type === 'youtube') {
          this.fireChangeAttribute({
            href: result.href,
            type: result.type,
          });
        }
      }
    }
  }

  fireChangeAttribute(attrs: ArenaAttributes): void {
    const event = new CustomEvent('arena-change-attribute', {
      bubbles: true,
      detail: {
        attrs,
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

  handleToggle(e: Event): void {
    if (e.path[0]) {
      this.fireChangeAttribute({
        border: e.path[0].checked,
      });
    }
  }

  // Render element DOM by returning a `lit-html` template.
  render(): TemplateResult {
    const loading = html`<p class="embed__content">
      Грузится ембед… <a href="${this.href || ''}">${this.href}</a>
    </p>`;
    if (this.type === 'facebook') {
      return html`
        <div
          data-href="${this.href || ''}"
          class="fb-post"
        >
          ${loading}
        </blockquote>`;
    }
    if (this.type === 'instagram') {
      return html`
        <blockquote
          class="instagram-media"
          data-instgrm-version="4"
          postid=${this.postid || ''}
          data-lang="ru">
          ${loading}
        </blockquote>`;
    }
    if (this.type === 'twitter') {
      return html`
        <blockquote class="twitter-tweet" postid=${this.postid || ''} data-lang="ru">
          <p class="embed__content">
            Грузится ембед… <a href="${this.href || ''}">${this.href}</a>
          </p>
        </blockquote>`;
    }
    if (this.type === 'youtube' && this.href) {
      return html`<div class=${classMap({ 'embed-youtube': true, 'embed-youtube_border': !!this.border })}>
        <div class="embed-youtube__toggle">
          Border: <input type="checkbox" @change="${this.handleToggle}" ?checked="${this.border}" />
        </div>
        <iframe
          class="embed-youtube-iframe"
          src="${this.href}"
          frameborder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          width="560"
          height="315"
          allowfullscreen=""></iframe>
      </div>`;
    }

    return html`<div class="wrapper">
      <form @submit="${this.handleSubmit}" class="form">
        <label for="link_input" class="form__label">Link:</label>
        <input id="link_input" type="text" @input="${this.handleInput}" class="form__input" />
        <input type="submit" value="Ок" class="form__btn" />
      </form>
    </div>`;
  }
}

class SimpleEmbed extends LitElement {
  protected currentHref = '';

  @property({
    type: String,
  })
  type: string | undefined;

  @property({
    type: String,
  })
  postid: string | undefined;

  @property({
    type: Boolean,
  })
  border: boolean | undefined;

  @property({
    type: String,
    reflect: true,
  })
  href: string | undefined;

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

  createRenderRoot(): LitElement {
    return this;
  }

  handleEvent(event: Event): void {
    // Prevent event from ArenaBrowser
    event.stopPropagation();
  }

  // Render element DOM by returning a `lit-html` template.
  render(): TemplateResult {
    const loading = html`<p class="embed__content">
      Грузится ембед… <a href="${this.href || ''}">${this.href}</a>
    </p>`;
    if (this.type === 'facebook') {
      return html`
        <div
          data-href="${this.href || ''}"
          data-name="facebook"
          class="fb-post"
          data-width="500"
        >
          ${loading}
        </blockquote>`;
    }
    if (this.type === 'instagram') {
      return html`
        <blockquote
          class="instagram-media"
          data-instgrm-version="4"
          postid=${this.postid || ''}
          data-lang="ru">
          ${loading}
        </blockquote>`;
    }
    if (this.type === 'twitter') {
      return html`
        <blockquote class="twitter-tweet" postid=${this.postid || ''} data-lang="ru">
          <p class="embed__content">
            Грузится ембед… <a href="${this.href || ''}">${this.href}</a>
          </p>
        </blockquote>`;
    }
    return html``;
  }
}

type MarkOptions = {
  tag: string,
  attributes: string[];
};

export type ExampleOptions = {
  name: string,
  tag: string,
  attributes: string[],
  allowedAttributes: string[],
  title: string,
  icon?: string,
  shortcut: string,
  hint: string,
  command: string,
  component: string,
  marks: MarkOptions[],
};

const defaultOptions: ExampleOptions = {
  name: 'embed',
  title: 'Embed',
  icon: `<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
     viewBox="0 0 511.997 511.997" style="enable-background:new 0 0 511.997 511.997;" xml:space="preserve">
  <g>
    <g>
      <path d="M506.76,242.828l-118.4-125.44c-7.277-7.718-19.424-8.07-27.142-0.787c-7.706,7.277-8.064,19.43-0.781,27.142
        l105.965,112.256L360.437,368.268c-7.283,7.712-6.925,19.859,0.781,27.142c3.712,3.501,8.454,5.235,13.178,5.235
        c5.101,0,10.195-2.022,13.965-6.01l118.4-125.446C513.742,261.785,513.742,250.226,506.76,242.828z" fill="currentColor"/>
    </g>
  </g>
  <g>
    <g>
      <path d="M151.566,368.262L45.608,255.999l105.958-112.262c7.277-7.712,6.925-19.866-0.787-27.142
        c-7.706-7.277-19.866-6.925-27.142,0.787l-118.4,125.44c-6.982,7.398-6.982,18.963,0,26.362L123.643,394.63
        c3.776,4,8.864,6.016,13.965,6.016c4.723,0,9.466-1.741,13.171-5.242C158.498,388.127,158.843,375.974,151.566,368.262z" fill="currentColor"/>
    </g>
  </g>
  <g>
    <g>
      <path d="M287.061,52.697c-10.477-1.587-20.282,5.606-21.882,16.083l-56.32,368.64c-1.6,10.483,5.6,20.282,16.083,21.882
        c0.986,0.147,1.958,0.218,2.925,0.218c9.325,0,17.504-6.803,18.957-16.301l56.32-368.64
        C304.744,64.095,297.544,54.297,287.061,52.697z" fill="currentColor"/>
    </g>
  </svg>`,
  tag: 'ARENA-EMBED',
  attributes: [
    'contenteditable="false"',
  ],
  allowedAttributes: ['href', 'type', 'postid', 'border'],
  shortcut: 'Alt + KeyE',
  hint: 'e',
  command: 'add-embed',
  component: 'arena-embed',
  marks: [
    {
      tag: 'ARENA-EMBED',
      attributes: [],
    },
  ],
};

const embedPlugin = (opts?: ExampleOptions): ArenaPlugin => ({
  register: (ta: Textarena) => {
    const {
      name, icon, title, tag, attributes,
      allowedAttributes, shortcut, hint, command, component, marks,
    } = { ...defaultOptions, ...(opts || {}) };
    if (!customElements.get(component)) {
      customElements.define(component, Embed);
    }
    if (!customElements.get('arena-embed-simple')) {
      customElements.define('arena-embed-simple', SimpleEmbed);
    }
    const arena = ta.registerArena(
      {
        name,
        tag,
        attributes,
        allowedAttributes,
        single: true,
      },
      marks,
      [ta.getRootArenaName()],
    ) as ArenaSingleInterface;
    ta.registerCommand(
      command,
      (someTa: Textarena, selection: ArenaSelection) => {
        const sel = someTa.insertBeforeSelected(selection, arena);
        return sel;
      },
    );
    ta.registerShortcut(
      shortcut,
      command,
    );
    ta.registerCreator({
      name,
      icon,
      title,
      shortcut,
      hint,
      command,
      canShow: (node: ArenaNodeText) =>
        node.parent.arena.allowedArenas.includes(arena),
    });

    ta.registerArena(
      {
        name: 'simple-embed',
        tag: 'ARENA-EMBED-SIMPLE',
        attributes: [
          'contenteditable="false"',
        ],
        allowedAttributes,
        single: true,
      },
      [
        {
          tag: 'ARENA-EMBED-SIMPLE',
          attributes: [],
        },
      ],
      [ta.getRootArenaName()],
    ) as ArenaSingleInterface;
    ta.subscribe('modelChanged', () => {
      if (typeof window !== 'undefined' && window.twttr) {
        // const items = document.querySelectorAll('.twitter-tweet');
        // items.forEach((el) => {
        //   const id = el.getAttribute('postid');
        //   const requested = el.getAttribute('requested');
        //   if (id && !requested) {
        //     console.log('REQUEEEEEEEEEEST!', id, el);
        //     el.setAttribute('requested', 'true');
        //     window.twttr.widgets.createTweet(id, el as HTMLElement);
        //   }
        // });
      }
      if (typeof window !== 'undefined' && window.FB) {
        window.FB.init({
          xfbml: true,
          version: 'v6.0',
        });
      }
      if (typeof window !== 'undefined' && window.instgrm) {
        window.instgrm.Embeds.process();
      }
    });
  },
});

export default embedPlugin;
