import {
  css, CSSResult, html, TemplateResult,
} from 'lit';
import { property } from 'lit/decorators.js';

import { WebComponent } from '../../helpers';
import { AnyArena } from '../../interfaces';
import { UploadVideoProcessor } from './types';

export class ArenaVideo extends WebComponent {
  @property({
    type: String,
  })
    src: string | undefined;

  @property({
    type: String,
  })
    type: string | undefined;

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
          display: contents;
        }
        .empty {
          display: flex;
          box-sizing: border-box;
          justify-content: center;
          align-items: center;
          background: rgb(245, 245, 245);
          padding: 0.2em;
          border: 0.2em dashed rgb(217, 217, 217);
          color: rgb(217, 217, 217);
          height: 100%;
          width: 100%;
          min-height: 10em;
        }
        .input {
          display: none;
        }
        .video-wrapper {
          position: relative;
        }
        .video {
          display: block;
          margin: 0 auto;
          max-width: 100%;
          max-height: 500px;
        }
        .svg {
          width: 3em;
          max-width: 80%;
          max-height: 80%;
          height: auto;
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
        .svg {
          width: 3em;
          max-width: 80%;
          max-height: 80%;
          height: auto;
        }
        label {
          cursor: pointer;
        }
        .edit svg {
          display: block;
        }
        :host(:hover) .edit {
          display: block;
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
      preview = html`
      <div class="video-wrapper">
        <video 
          class="video"
          loop
          autoplay
          muted
          playsinline
          src="${this.src}"
          type="${this.type ?? 'video/mp4'}"
          @load="${this.onLoad}"
        >
        </video>
        <label for="input" class="edit">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M0 0h24v24H0z" fill="none"/><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
        </label>
      </div>`;
    } else {
      preview = html`<label for="input" class="empty">
        <svg 
          class="svg"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          xml:space="preserve"
        >
          <g>
            <g>
              <path d="M501.801,26.212H10.199C4.566,26.212,0,30.778,0,36.411v439.178c0,5.633,4.566,10.199,10.199,10.199h491.602
                c5.632,0,10.199-4.566,10.199-10.199V36.411C512,30.778,507.433,26.212,501.801,26.212z M20.398,266.199h77.514v89.753H20.398
                V266.199z M491.602,245.801h-48.956c-5.632,0-10.199,4.566-10.199,10.199c0,5.633,4.567,10.199,10.199,10.199h48.956v89.753
                h-48.956c-5.632,0-10.199,4.566-10.199,10.199c0,5.633,4.567,10.199,10.199,10.199h48.956v89.039H20.398v-89.039h77.514v66.295
                c0,5.633,4.566,10.199,10.199,10.199h295.777c5.632,0,10.199-4.566,10.199-10.199V156.048h77.514V245.801z M118.311,432.446
                V79.554h275.378v352.892H118.311z M491.602,135.649h-77.514V69.355c0-5.633-4.567-10.199-10.199-10.199H108.112
                c-5.633,0-10.199,4.566-10.199,10.199v176.446H20.398v-89.753h52.016c5.633,0,10.199-4.566,10.199-10.199
                c0-5.633-4.566-10.199-10.199-10.199H20.398V46.61h471.203V135.649z"/>
            </g>
            <g>
              <path d="M330.334,247.752l-123.41-89.753c-3.103-2.257-7.209-2.581-10.627-0.84c-3.42,1.74-5.572,5.253-5.572,9.089v179.506
                c0,3.836,2.152,7.349,5.571,9.089c1.461,0.744,3.047,1.111,4.627,1.111c2.117,0,4.224-0.659,6-1.951l123.41-89.753
                c2.639-1.919,4.2-4.985,4.2-8.248C334.534,252.737,332.972,249.67,330.334,247.752z M211.124,325.724V186.276L306.994,256
                L211.124,325.724z"/>
            </g>
            <g>
              <path d="M372.271,90.773c-5.632,0-10.199,4.566-10.199,10.199v86.693c0,5.633,4.567,10.199,10.199,10.199
                s10.199-4.566,10.199-10.199v-86.693C382.47,95.339,377.903,90.773,372.271,90.773z"/>
            </g>
            <g>
              <path d="M372.271,212.143c-5.632,0-10.199,4.566-10.199,10.199v13.259c0,5.633,4.567,10.199,10.199,10.199
                s10.199-4.566,10.199-10.199v-13.259C382.47,216.71,377.903,212.143,372.271,212.143z"/>
            </g>
          </g>
        </svg>
      </label>`;
    }
    return html`
      ${preview}
      <input class="input" id=input type="file" accept="video/mp4" @change=${this.onChange}/>
    `;
  }

  protected onLoad(): void {
    this.fireCustomEvent('contentResize');
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
      const upload = this.arena.getAttribute('upload') as UploadVideoProcessor;
      if (upload) {
        try {
          upload(file).then(({ src, mime }) => {
            if (src) {
              setTimeout(() => {
                const event = new CustomEvent('change', {
                  detail: src,
                });
                this.dispatchEvent(event);
                this.fireChangeAttribute({ src, mime });
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
