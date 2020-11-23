import xss from 'xss';
import sanitizeHtml from 'sanitize-html';

export default class HTMLLicker {
  constructor(private html: string) {
  }

  prepareHTML(): HTMLLicker {
    return this
      .xss();
    // .checkFirstLine();
  }

  xssFull(): HTMLLicker {
    return new HTMLLicker(xss(
      this.html,
      { escapeHtml: (html) => html.replace(/\n/g, '<br />') },
    ));
  }

  xss(): HTMLLicker {
    return new HTMLLicker(xss(
      this.html,
      {
        escapeHtml: (html) => html.replace(/\n/g, '<br />'),
        whiteList: {
          h1: [],
          h2: [],
          h3: [],
          h4: [],
          h5: [],
          h6: [],
          b: [],
          strong: [],
          i: [],
          u: [],
          p: ['class'],
          br: [],
          hr: [],
          div: ['contenteditable', 'class'],
          a: ['href', 'target'],
          ol: [],
          ul: [],
          li: [],
        },
      },
    ));
  }

  sanitize(): HTMLLicker {
    return new HTMLLicker(sanitizeHtml(this.html, {
      allowedAttributes: {
        h1: [],
        h2: [],
        h3: [],
        h4: [],
        h5: [],
        h6: [],
        b: [],
        strong: [],
        strike: [],
        i: [],
        u: [],
        p: [],
        br: [],
        hr: [],
        a: ['href'],
      },
      allowedSchemesByTag: {
        a: ['https', 'mailto', 'tel'],
      },
      exclusiveFilter(frame) {
        return frame.tag === 'a' && !frame.text.trim();
      },
      nonTextTags: ['style', 'script', 'textarea', 'option', 'noscript'],
      textFilter: (text) => text.replace(/\n/g, '<br />'),
      transformTags: {
        strong: 'b',
      },
      parser: {
        lowerCaseTags: true,
        lowerCaseAttributeNames: true,
      },
      enforceHtmlBoundary: true,
    }));
  }

  getHtml(): string {
    return this.html;
  }
}
