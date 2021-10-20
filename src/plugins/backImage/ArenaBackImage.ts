import {
  html, css, TemplateResult, property,
} from 'lit-element';
import WebComponent from '../../helpers/WebComponent';
import { AnyArena } from '../../interfaces/Arena';
import { ScrProcessor } from '../image/types';

export default class ArenaBackImage extends WebComponent {
  @property({
    type: String,
  })
  src: string | undefined;

  @property({
    type: Object,
  })
  arena: AnyArena | undefined;

  loading = false;

  static styles = css`
    :host {
      display: flex;
      min-height: 2em;
      position: relative;
    }
    .input {
      display: none;
    }
    .edit {
      position: absolute;
      right: 50%;
      transform: translateX(0.7em);
      top: 0.2em;
      color: rgb(136, 136, 136);
      background: white;
      padding: 0.3em;
      border-radius: 0.8em;
      width: 1.4em;
      height: 1.4em;
      box-sizing: border-box;
      display: none;
    }
    .edit svg {
      display: block;
    }
    :host(:hover) .edit {
      display: block;
    }
    .img {
      position: absolute;
      inset: 0;
      object-fit: cover;
      display: block;
      width: 100%;
      height: 100%;
    }
    .body {
      z-index: 1;
      position: relative;
    }
  `;

  get input(): HTMLInputElement | undefined {
    const input = this.renderRoot.querySelector('#input');
    return input ? input as HTMLInputElement : undefined;
  }

  render(): TemplateResult {
    return html`
      <div class="back">
        ${this.src ? html`<img class="img" src="${this.getScr(this.src)}" @load="${this.onLoad}" />` : ''}
        <label for="input" class="edit">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M0 0h24v24H0z" fill="none"/><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
        </label>
        <input class="input" id=input type="file" @change=${this.onChange}/>
        <div class="body">
          <slot></slot>
        </div>
      </div>
    `;
  }

  protected getScr(src: string, width?: number, height?: number): string {
    if (this.arena) {
      const prepareSrc = this.arena.getAttribute('prepareSrc') as ScrProcessor;
      try {
        return prepareSrc(src, width, height);
      } catch (e) {
        //
      }
    }
    return '';
  }

  protected onLoad(): void {
    this.fireCustomEvent('imageLoaded');
  }

  protected onChange(): void {
    if (this.input?.files && this.input?.files?.length > 0) {
      this.upload(this.input.files[0]);
    }
  }

  protected upload(file: File): void {
    this.loading = true;
    this.requestUpdate();
    if (this.arena) {
      const upload = this.arena.getAttribute('upload') as UploadProcessor;
      if (upload) {
        try {
          upload(file).then(({ src }) => {
            if (src) {
              setTimeout(() => {
                const event = new CustomEvent('change', {
                  detail: src,
                });
                this.dispatchEvent(event);
                this.fireChangeAttribute({ src });
              }, 2000);
            }
            this.loading = false;
            this.requestUpdate();
          }).catch(() => {
            this.loading = false;
            this.requestUpdate();
          });
        } catch (e) {
          this.loading = false;
          this.requestUpdate();
        }
      }
    }
  }
}
