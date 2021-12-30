import {
  css, html, LitElement, TemplateResult,
} from 'lit';
import { property } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import embedServices from './embedServices';

export default class ArenaEmbedIFrameResizable extends LitElement {
  // The src attribute for iframe element if type property is set
  @property({
    type: String,
  })
    embed = '';

  // key of the EmbedServiceMap in ./embedServices.ts
  @property({
    type: String,
  })
    type = '';

  @property({
    type: String,
  })
    iframewidth = '600px';

  @property({
    type: String,
  })
    iframeheight = '400px';

  static styles = css`
    iframe {
      position: absolute:
      top: 0;
      left: 0;
      width: 100%;
    }
    .resizable {
      background: white;
      width: 600px;
      height: 400px;
      max-width: 100%;
      position: relative;
      overflow: hidden;
    }
    
    .resizable .resizer {
      width: 10px;
      height: 10px;
      position: absolute;
      display: none;
    }

    .resizable:hover .resizer {
      display: block;
    }
    
    .resizable .resizer.top-left {
      border-top: 3px solid #4286f4;
      border-left: 3px solid #4286f4;
      left: 0;
      top: 0;
      cursor: nwse-resize; /*resizer cursor*/
    }
    .resizable .resizer.top-right {
      border-top: 3px solid #4286f4;
      border-right: 3px solid #4286f4;
      right: 0;
      top: 0;
      cursor: nesw-resize;
    }
    .resizable .resizer.bottom-left {
      border-bottom: 3px solid #4286f4;
      border-left: 3px solid #4286f4;
      left: 0;
      bottom: 0;
      cursor: nesw-resize;
    }
    .resizable .resizer.bottom-right {
      border-bottom: 3px solid #4286f4;
      border-right: 3px solid #4286f4;
      right: 0;
      bottom: 0;
      cursor: nwse-resize;
    }
  `;

  firstUpdated() {
    this.makeResizableDiv('.resizable');
  }

  get iframeId() {
    return `iframe-${this.type}-${this.embed?.split('/').pop()?.split('?').pop()}`;
  }

  makeResizableDiv(div: string) {
    if (!this.shadowRoot) return;
    const element: HTMLDivElement | null = this.shadowRoot.querySelector(div);
    if (!element) return;
    element.style.width = this.iframewidth;
    element.style.height = this.iframeheight;
    const iframe: HTMLIFrameElement | null = this.shadowRoot.querySelector('iframe');
    if (!iframe) return;
    iframe.style.height = this.iframeheight;
    const resizingElement = this.shadowRoot.querySelector(`${div} .resizer`);
    if (!resizingElement) return;
    const minimumSize = 200;
    let originalWidth = 0;
    let originalHeight = 0;
    let originalX = 0;
    let originalY = 0;
    let originalMouseX = 0;
    let originalMouseY = 0;
    const resize = (e: MouseEvent) => {
      if (resizingElement.classList.contains('bottom-right')) {
        const width = originalWidth + (e.pageX - originalMouseX);
        const height = originalHeight + (e.pageY - originalMouseY);
        if (width > minimumSize) {
          element.style.width = `${width}px`;
        }
        if (height > minimumSize) {
          element.style.height = `${height}px`;
        }
      } else if (resizingElement.classList.contains('bottom-left')) {
        const height = originalHeight + (e.pageY - originalMouseY);
        const width = originalWidth - (e.pageX - originalMouseX);
        if (height > minimumSize) {
          element.style.height = `${height}px`;
        }
        if (width > minimumSize) {
          element.style.width = `${width}px`;
          element.style.left = `${originalX + (e.pageX - originalMouseX)}px`;
        }
      } else if (resizingElement.classList.contains('top-right')) {
        const width = originalWidth + (e.pageX - originalMouseX);
        const height = originalHeight - (e.pageY - originalMouseY);
        if (width > minimumSize) {
          element.style.width = `${width}px`;
        }
        if (height > minimumSize) {
          element.style.height = `${height}px`;
          element.style.top = `${originalY + (e.pageY - originalMouseY)}px`;
        }
      } else {
        const width = originalWidth - (e.pageX - originalMouseX);
        const height = originalHeight - (e.pageY - originalMouseY);
        if (width > minimumSize) {
          element.style.width = `${width}px`;
          element.style.left = `${originalX + (e.pageX - originalMouseX)}px`;
        }
        if (height > minimumSize) {
          element.style.height = `${height}px`;
          element.style.top = `${originalY + (e.pageY - originalMouseY)}px`;
        }
      }
      iframe.style.height = element.style.height;
    };
    const stopResize = () => {
      window.removeEventListener('mousemove', resize);
      this.iframewidth = element.style.width;
      this.iframeheight = element.style.height;
      const event = new CustomEvent(
        'change',
        {
          detail: {
            iframewidth: element.style.width,
            iframeheight: element.style.height,
          },
        },
      );
      this.dispatchEvent(event);
    };
    resizingElement.addEventListener('mousedown', (event) => {
      const e = event as MouseEvent;
      e.preventDefault();
      originalWidth = parseFloat(getComputedStyle(element, null).getPropertyValue('width').replace('px', ''));
      originalHeight = parseFloat(getComputedStyle(element, null).getPropertyValue('height').replace('px', ''));
      originalX = element.getBoundingClientRect().left;
      originalY = element.getBoundingClientRect().top;
      originalMouseX = e.pageX;
      originalMouseY = e.pageY;
      window.addEventListener('mousemove', resize);
      window.addEventListener('mouseup', stopResize);
    });
  }

  render(): TemplateResult | undefined {
    if (this.embed && this.type) {
      const service = embedServices[this.type];
      if (service) {
        const { html: htmlTemplate } = service;
        return html`
          <div class='resizable'>
            ${unsafeHTML(htmlTemplate.replace(/^<([^>]+?)>/, `<$1 src="${this.embed}">`))}
            <div class='resizer bottom-right'></div>
          </div>        
        `;
      }
    }
    return undefined;
  }
}
