import { css, html, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import WebComponent from '../../helpers/WebComponent';
import embedServices from './embedServices';
import { EmbedElem, EmbedService } from './types';

const createElemEmbed = (url: string): EmbedElem | undefined => {
  const keys = Object.keys(embedServices);
  let type: string | undefined;
  let service: EmbedService | undefined;
  let found = false;
  for (let i = 0; i < keys.length; i += 1) {
    type = keys[i];
    service = embedServices[type];
    if (service.regex.test(url)) {
      found = true;
      break;
    }
  }
  if (!found || !service || !type) return undefined;
  const {
    regex,
    embedUrl,
    width: ew,
    height: eh,
    id = (ids: string[]) => ids.shift() as string,
  } = service;
  const result = regex.exec(url)?.slice(1) as string[];
  const embed = embedUrl.replace(/<%= remote_id %>/g, id(result));
  return {
    type,
    embed,
    ew,
    eh,
  };
};

export default class ArenaEmbedForm extends WebComponent {
  @property({
    type: String,
    reflect: true,
  })
    embed: string | undefined;

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
