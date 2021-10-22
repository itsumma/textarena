import { classMap } from 'lit/directives/class-map.js';
import { css, TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import WebComponent from '../../helpers/WebComponent';

export default class ArenaEmbedYoutube extends WebComponent {
  @property({
    type: String,
    reflect: true,
  })
    href: string | undefined;

  @property({
    type: Boolean,
  })
    border: boolean | undefined;

  static styles = css`
    :host {
      user-select: none;
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
      border-radius: 0.5em;
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
      border-radius: 1em;
      padding: 0.2rem 1em;
      left: 1em;
      top: 1em;
    }
  `;

  handleToggle(e: Event): void {
    const event = e as unknown as { path: HTMLInputElement[] };
    if (event.path[0]) {
      const customEvent = new CustomEvent('toggle', {
        detail: event.path[0].checked,
      });
      this.dispatchEvent(customEvent);
    }
  }

  // Render element DOM by returning a `lit-html` template.
  render(): TemplateResult | undefined {
    if (this.href) {
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
          allowfullscreen=""
        ></iframe>
      </div>`;
    }
    return undefined;
  }
}
