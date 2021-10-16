import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';

export default class ArenaEmbedSimple extends LitElement {
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
    type: String,
  })
    href: string | undefined;

  createRenderRoot(): LitElement {
    return this;
  }

  // Render element DOM by returning a `lit-html` template.
  render(): TemplateResult | undefined {
    if (this.href) {
      const loading = html`<p class="embed__content">
        Грузится ембед… <a href="${this.href || ''}">${this.href}</a>
      </p>`;
      if (this.type === 'facebook') {
        return html`
          <div
            class="fb-post"
            data-href="${this.href}"
            data-width="auto"
            data-show-captions="false"
          ></div>
        `;
      }
      if (this.type === 'instagram') {
        return html`
          <blockquote
            class="instagram-media"
            data-instgrm-version="13"
            postid=${this.postid || ''}
            style="background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:540px; min-width:326px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);"
            data-lang="ru"
          >
            ${loading}
          </blockquote>`;
      }
      if (this.type === 'twitter') {
        return html`
          <blockquote class="twitter-tweet" postid=${this.postid || ''} data-lang="ru">
            <p class="embed__content">
              Грузится ембед… <a href="${this.href}">${this.href}</a>
            </p>
          </blockquote>`;
      }
    }
    return undefined;
  }
}
