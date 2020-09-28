import xss from 'xss';

export default class HTMLLicker {
  constructor (private html: string) {

  }

  prepareHTML() {
    return this
      .xss();
      // .checkFirstLine();
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
          strike: [],
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

  getHtml() {
    return this.html;
  }


}
