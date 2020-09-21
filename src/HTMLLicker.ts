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
    return new HTMLLicker(xss(this.html));
  }

  getHtml() {
    return this.html;
  }


}
