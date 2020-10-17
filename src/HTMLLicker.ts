import xss from 'xss';
import sanitizeHtml from 'sanitize-html';

export default class HTMLLicker {
  constructor (private html: string) {

  }

  prepareHTML() {
    return this
      .xss();
      // .checkFirstLine();
  }

  xssFull() {
    return new HTMLLicker(xss(
      this.html,
      { }
    ));
  }

  xss() {
    return new HTMLLicker(xss(
      this.html,
      {
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
        }
      }
    ));
  }

  sanitize() {
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
      exclusiveFilter: function(frame) {
        // return frame.tag === 'a' && !frame.text.trim();
        return !frame.text.trim();
      },
      nonTextTags: [ 'style', 'script', 'textarea', 'option', 'noscript' ],
      transformTags: {
        strong: 'b',
      },
      parser: {
        lowerCaseTags: true,
        lowerCaseAttributeNames: true,
      },
      enforceHtmlBoundary: true
    }));
  }

  getHtml() {
    return this.html;
  }


}
