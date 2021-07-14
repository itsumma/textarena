import {
  html, css, property, TemplateResult, CSSResult,
} from 'lit-element';
import WebComponent from '../../helpers/WebComponent';
import { AnyArena } from '../../interfaces/Arena';
import { ScrProcessor, UploadProcessor } from './types';

export default class ArenaImage extends WebComponent {
  @property({
    type: String,
  })
  src: string | undefined;

  @property({
    type: Number,
  })
  width: number | undefined;

  @property({
    type: Number,
  })
  height: number | undefined;

  @property({
    type: Object,
  })
  arena: AnyArena | undefined;

  loading = false;

  get input(): HTMLInputElement | undefined {
    const input = this.renderRoot.querySelector('#input');
    return input ? input as HTMLInputElement : undefined;
  }

  static get styles(): CSSResult[] {
    return [
      css`
        :host {
          display: block;
          margin: 0;
          user-select: none;
        }
        .empty {
          display: flex;
          box-sizing: border-box;
          justify-content: center;
          align-items: center;
          background: #e6e6e6;
          /* padding-top: 56.25%; */
          padding: .2rem;
          border: 3px solid #d0d0d0;
          color: #ccc;
          height: 100%;
          width: 100%;
        }
        .input {
          display: none;
        }
        .img {
          display: block;
          max-width: 100%;
          margin: auto;
        }
        .svg {
          width: 3rem;
          max-width: 80%;
          max-height: 80%;
          height: auto;
        }
        label {
          cursor: pointer;
        }
      `,
    ];
  }

  // Render element DOM by returning a `lit-html` template.
  render(): TemplateResult {
    let preview;
    if (this.loading) {
      preview = html`<div class="empty">Грузится…</div>`;
    } else if (this.src) {
      preview = html`<label for="input">
        <img class="img" src="${this.getScr(this.src, this.width, this.height)}" />
      </label>`;
    } else {
      preview = html`<label for="input" class="empty">
        <svg class="svg" viewBox="0 -18 512 512" xmlns="http://www.w3.org/2000/svg"><path d="m432 0h-352c-44.113281 0-80 35.886719-80 80v280c0 44.113281 35.886719 80 80 80h273c11.046875 0 20-8.953125 20-20s-8.953125-20-20-20h-73.664062l-45.984376-59.65625 145.722657-185.347656 98.097656 108.421875c5.546875 6.136719 14.300781 8.21875 22.019531 5.246093 7.714844-2.976562 12.808594-10.394531 12.808594-18.664062v-170c0-44.113281-35.886719-80-80-80zm40 198.085938-79.167969-87.503907c-3.953125-4.371093-9.640625-6.785156-15.523437-6.570312-5.886719.207031-11.386719 2.996093-15.03125 7.628906l-154.117188 196.023437-52.320312-67.875c-3.785156-4.910156-9.636719-7.789062-15.839844-7.789062-.003906 0-.007812 0-.011719 0-6.203125.003906-12.058593 2.886719-15.839843 7.804688l-44.015626 57.21875c-6.734374 8.757812-5.097656 21.3125 3.65625 28.046874 8.757813 6.738282 21.3125 5.097657 28.050782-3.65625l28.175781-36.632812 88.816406 115.21875h-148.832031c-22.054688 0-40-17.945312-40-40v-280c0-22.054688 17.945312-40 40-40h352c22.054688 0 40 17.945312 40 40zm0 0" fill="currentColor"/><path d="m140 72c-33.085938 0-60 26.914062-60 60s26.914062 60 60 60 60-26.914062 60-60-26.914062-60-60-60zm0 80c-11.027344 0-20-8.972656-20-20s8.972656-20 20-20 20 8.972656 20 20-8.972656 20-20 20zm0 0" fill="currentColor"/><path d="m468.476562 302.941406c-.058593-.058594-.117187-.121094-.175781-.179687-9.453125-9.519531-22.027343-14.761719-35.410156-14.761719-13.34375 0-25.882813 5.210938-35.324219 14.675781l-38.613281 38.085938c-7.863281 7.753906-7.949219 20.417969-.191406 28.28125 7.753906 7.863281 20.417969 7.953125 28.28125.195312l25.847656-25.492187v112.253906c0 11.046875 8.953125 20 20 20s20-8.953125 20-20v-111.644531l24.738281 25.554687c3.921875 4.054688 9.144532 6.089844 14.371094 6.089844 5.011719 0 10.027344-1.871094 13.910156-5.628906 7.9375-7.683594 8.140625-20.34375.457032-28.28125zm0 0" fill="currentColor"/></svg>
      </label>`;
    }
    return html`
      ${preview}
      <input class="input" id=input type="file" @change=${this.onChange}/>
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
          });
        } catch (e) {
          //
        }
        return;
      }
    }

    const data = new FormData();
    data.append('file', file);
    fetch('https://izo.itsumma.ru', {
      method: 'POST',
      body: data,
      headers: {
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiY2xpZW50IiwidG9rZW5JZCI6ImQyNzRhOTAzLTAyYWMtNGE2MS1hNmNiLTdiOTlkZGQ0YmIyNiIsInVzZXJuYW1lIjoidGVzdCIsImlhdCI6MTYxNDIzMzY4NywiZXhwIjoxNjQ1NzY5Njg3fQ.fEzuI8L9P7z9tcZ7PiocLQrf_gW9CF_JxrpQLxYHDRk',
      },
    }).then((response) => {
      if (response.ok) {
        response.json().then((src) => {
          if (src) {
            setTimeout(() => {
              const event = new CustomEvent('change', {
                detail: { src },
              });
              this.loading = false;
              this.dispatchEvent(event);
              this.fireChangeAttribute({ src });
              this.requestUpdate();
            }, 2000);
          }
        }).catch(() => {
          this.loading = false;
          this.requestUpdate();
        });
      }
    }).catch(() => {
      this.loading = false;
      this.requestUpdate();
    });
  }
}