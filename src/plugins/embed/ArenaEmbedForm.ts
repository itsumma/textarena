import { css, html, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import WebComponent from '../../helpers/WebComponent';

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
      border: true,
      href: src,
    };
  }
  if (name === 'facebook') {
    return {
      type: 'facebook',
      href,
    };
  }
  if (name === 'twitter') {
    const paths = url.pathname.split('/');
    if (paths[paths.length - 2] === 'status') {
      const postid = paths[paths.length - 1];
      if (postid) {
        return {
          type: 'twitter',
          postid,
          href,
        };
      }
    }
  }
  if (name === 'instagram') {
    return {
      type: 'instagram',
      href,
    };
  }
  return undefined;
};

export default class ArenaEmbedForm extends WebComponent {
  protected currentHref = '';

  @property({
    type: String,
    reflect: true,
  })
    href: string | undefined;

  inputValue = '';

  static styles = css`
    :host {
      user-select: none;
    }
    .wrapper {
      background: white;
      border: 1px solid #ccc;
      border-radius: 1em;
      padding: 1rem 2em;
      margin: 0 0 1em;
    }
    .form {
      display: flex;
    }
    .form__label {
      margin-right: 1em;
    }
    .form__input {
      border: 0;
      border-bottom: 1px solid #ccc;
      border-radius: 0;
      margin-right: 1em;
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
      border-radius: 1em;
      font-size: 1em;
      padding: 0.1em 1em;
    }
    .form__btn:active,
    .form__btn:focus,
    .form__btn:hover {
      outline: none;
      border-color: black;
    }
  `;

  handleSubmit(e: Event): void {
    e.preventDefault();
    if (this.inputValue) {
      const result = createElemEmbed(this.inputValue);
      if (result) {
        this.fireCustomEvent({
          name: 'embed submit',
        });
        const event = new CustomEvent('change', {
          detail: result,
        });
        this.dispatchEvent(event);
      }
    }
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
    return html`<div class="wrapper">
      <form @submit="${this.handleSubmit}" class="form">
        <label for="link_input" class="form__label">Link:</label>
        <input id="link_input" type="text" @input="${this.handleInput}" class="form__input" />
        <input type="submit" value="Ок" class="form__btn" />
      </form>
    </div>`;
  }
}
