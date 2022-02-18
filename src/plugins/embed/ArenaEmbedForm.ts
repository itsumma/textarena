import { css, html, TemplateResult } from 'lit';
import { WebComponent } from '../../helpers';

export class ArenaEmbedForm extends WebComponent {
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
      const event = new CustomEvent(
        'change',
        {
          detail: {
            value: this.inputValue,
          },
        },
      );
      this.dispatchEvent(event);
    }
  }

  handleInput(e: InputEvent): void {
    if (!e.currentTarget) {
      return;
    }
    const { value } = e.currentTarget as HTMLInputElement;
    this.inputValue = value;
  }

  connectedCallback() {
    super.connectedCallback();
    setTimeout(() => this.shadowRoot?.getElementById('link_input')?.focus());
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
