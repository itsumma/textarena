/// <reference types="cypress" />

import { isMac } from '../../src/utils/navigator';

const ctrl = isMac() ? 'cmd' : 'ctrl';

context('Actions', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080/');
    cy.get('.textarena-editor').focus();
    cy.get('.textarena-editor')
      .as('root')
      .focus()
      .type('{selectall}')
      .type('{del}');
  });

  it('Contents', () => {
    cy
      .get('@root')
      .focus()
      .type(`{${ctrl}+alt+2}`)
      .type('Contents{enter}')
      .type(`{${ctrl}+alt+3}`)
      .type('Lorem{enter}')
      .type('Lorem ipsum dolor sit amet, consectetur adipiscing elit.{enter}')
      .type('Pellentesque id mattis sem. Nam blandit massa mi.{enter}')
      .type(`{${ctrl}+alt+3}`)
      .type('Fusce{enter}')
      .type('Fusce placerat purus leo, in tincidunt sapien semper eu. Ut sollicitudin, mi id mollis auctor, dolor sapien interdum est, nec aliquet justo quam non elit.{enter}')
      .type(`{${ctrl}+alt+3}`)
      .type('Sed sed nulla{enter}')
      .type('Sed sed nulla vitae risus iaculis tincidunt. Pellentesque convallis leo risus, vitae faucibus felis consectetur non.{enter}')
      .type('Sed convallis elit quis orci volutpat, non accumsan elit commodo.')
      .setSelection('Contents')
      .type('{end}{enter}')
      .type(`{${ctrl}+alt+C}`)
      .setSelection('Lorem')
      .type('{leftArrow}{backspace}')
      .wait(100)
      .get('#html')
      .contains('<h2 id="contents">Contents</h2><div class="contents"><h3 class="contents__title">Содержание</h3><ul><li><a href="#contents">Contents</a></li><li><a href="#lorem">Lorem</a></li><li><a href="#fusce">Fusce</a></li><li><a href="#sed-sed-nulla">Sed sed nulla</a></li></ul></div><h3 id="lorem">Lorem</h3><p class="paragraph">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p><p class="paragraph">Pellentesque id mattis sem. Nam blandit massa mi.</p><h3 id="fusce">Fusce</h3><p class="paragraph">Fusce placerat purus leo, in tincidunt sapien semper eu. Ut sollicitudin, mi id mollis auctor, dolor sapien interdum est, nec aliquet justo quam non elit.</p><h3 id="sed-sed-nulla">Sed sed nulla</h3><p class="paragraph">Sed sed nulla vitae risus iaculis tincidunt. Pellentesque convallis leo risus, vitae faucibus felis consectetur non.</p><p class="paragraph">Sed convallis elit quis orci volutpat, non accumsan elit commodo.</p>')
      .get('@root')
      .setSelection('Contents')
      .type('Lorem Ipsum text')
      .get('arena-contents')
      .shadow()
      .find('button')
      .click()
      .wait(100)
      .get('#html')
      .contains('<h2 id="lorem-ipsum-text">Lorem Ipsum text</h2><div class="contents"><h3 class="contents__title">Содержание</h3><ul><li><a href="#lorem-ipsum-text">Lorem Ipsum text</a></li><li><a href="#lorem">Lorem</a></li><li><a href="#fusce">Fusce</a></li><li><a href="#sed-sed-nulla">Sed sed nulla</a></li></ul></div><h3 id="lorem">Lorem</h3><p class="paragraph">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p><p class="paragraph">Pellentesque id mattis sem. Nam blandit massa mi.</p><h3 id="fusce">Fusce</h3><p class="paragraph">Fusce placerat purus leo, in tincidunt sapien semper eu. Ut sollicitudin, mi id mollis auctor, dolor sapien interdum est, nec aliquet justo quam non elit.</p><h3 id="sed-sed-nulla">Sed sed nulla</h3><p class="paragraph">Sed sed nulla vitae risus iaculis tincidunt. Pellentesque convallis leo risus, vitae faucibus felis consectetur non.</p><p class="paragraph">Sed convallis elit quis orci volutpat, non accumsan elit commodo.</p>')
      .get('arena-contents')
      .shadow()
      .find('ul > li:nth-child(4) input.input-title')
      .type('{selectall}Dorem{enter}', { force: true, waitForAnimations: false })
      .get('#html')
      .contains('<h2 id="lorem-ipsum-text">Lorem Ipsum text</h2><div class="contents"><h3 class="contents__title">Содержание</h3><ul><li><a href="#lorem-ipsum-text">Lorem Ipsum text</a></li><li><a href="#lorem">Lorem</a></li><li><a href="#fusce">Fusce</a></li><li><a href="#sed-sed-nulla">Dorem</a></li></ul></div><h3 id="lorem">Lorem</h3><p class="paragraph">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p><p class="paragraph">Pellentesque id mattis sem. Nam blandit massa mi.</p><h3 id="fusce">Fusce</h3><p class="paragraph">Fusce placerat purus leo, in tincidunt sapien semper eu. Ut sollicitudin, mi id mollis auctor, dolor sapien interdum est, nec aliquet justo quam non elit.</p><h3 id="sed-sed-nulla">Sed sed nulla</h3><p class="paragraph">Sed sed nulla vitae risus iaculis tincidunt. Pellentesque convallis leo risus, vitae faucibus felis consectetur non.</p><p class="paragraph">Sed convallis elit quis orci volutpat, non accumsan elit commodo.</p>')
      .get('arena-contents')
      .shadow()
      .find('ul > li:nth-child(4) button.reset')
      .click()
      .wait(100)
      .get('#html')
      .contains('<h2 id="lorem-ipsum-text">Lorem Ipsum text</h2><div class="contents"><h3 class="contents__title">Содержание</h3><ul><li><a href="#lorem-ipsum-text">Lorem Ipsum text</a></li><li><a href="#lorem">Lorem</a></li><li><a href="#fusce">Fusce</a></li><li><a href="#sed-sed-nulla">Sed sed nulla</a></li></ul></div><h3 id="lorem">Lorem</h3><p class="paragraph">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p><p class="paragraph">Pellentesque id mattis sem. Nam blandit massa mi.</p><h3 id="fusce">Fusce</h3><p class="paragraph">Fusce placerat purus leo, in tincidunt sapien semper eu. Ut sollicitudin, mi id mollis auctor, dolor sapien interdum est, nec aliquet justo quam non elit.</p><h3 id="sed-sed-nulla">Sed sed nulla</h3><p class="paragraph">Sed sed nulla vitae risus iaculis tincidunt. Pellentesque convallis leo risus, vitae faucibus felis consectetur non.</p><p class="paragraph">Sed convallis elit quis orci volutpat, non accumsan elit commodo.</p>')
      .get('arena-contents')
      .shadow()
      .find('ul > li:nth-child(3) input[type="checkbox"]')
      .uncheck()
      .wait(100)
      .get('#html')
      .contains('<h2 id="lorem-ipsum-text">Lorem Ipsum text</h2><div class="contents"><h3 class="contents__title">Содержание</h3><ul><li><a href="#lorem-ipsum-text">Lorem Ipsum text</a></li><li><a href="#lorem">Lorem</a></li><li><a href="#sed-sed-nulla">Sed sed nulla</a></li></ul></div><h3 id="lorem">Lorem</h3><p class="paragraph">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p><p class="paragraph">Pellentesque id mattis sem. Nam blandit massa mi.</p><h3 id="fusce">Fusce</h3><p class="paragraph">Fusce placerat purus leo, in tincidunt sapien semper eu. Ut sollicitudin, mi id mollis auctor, dolor sapien interdum est, nec aliquet justo quam non elit.</p><h3 id="sed-sed-nulla">Sed sed nulla</h3><p class="paragraph">Sed sed nulla vitae risus iaculis tincidunt. Pellentesque convallis leo risus, vitae faucibus felis consectetur non.</p><p class="paragraph">Sed convallis elit quis orci volutpat, non accumsan elit commodo.</p>')
      .get('arena-contents')
      .shadow()
      .find('ul > li:nth-child(3) input[type="checkbox"]')
      .check()
      .wait(100)
      .get('#html')
      .contains('<h2 id="lorem-ipsum-text">Lorem Ipsum text</h2><div class="contents"><h3 class="contents__title">Содержание</h3><ul><li><a href="#lorem-ipsum-text">Lorem Ipsum text</a></li><li><a href="#lorem">Lorem</a></li><li><a href="#fusce">Fusce</a></li><li><a href="#sed-sed-nulla">Sed sed nulla</a></li></ul></div><h3 id="lorem">Lorem</h3><p class="paragraph">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p><p class="paragraph">Pellentesque id mattis sem. Nam blandit massa mi.</p><h3 id="fusce">Fusce</h3><p class="paragraph">Fusce placerat purus leo, in tincidunt sapien semper eu. Ut sollicitudin, mi id mollis auctor, dolor sapien interdum est, nec aliquet justo quam non elit.</p><h3 id="sed-sed-nulla">Sed sed nulla</h3><p class="paragraph">Sed sed nulla vitae risus iaculis tincidunt. Pellentesque convallis leo risus, vitae faucibus felis consectetur non.</p><p class="paragraph">Sed convallis elit quis orci volutpat, non accumsan elit commodo.</p>')
      .get('@root')
      .setSelection('Fusce placerat purus leo, in tincidunt sapien semper eu. Ut sollicitudin, mi id mollis auctor, dolor sapien interdum est, nec aliquet justo quam non elit.')
      .type('{backspace}{backspace}')
      .type('{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}')
      .get('arena-contents')
      .shadow()
      .find('button')
      .click()
      .wait(100)
      .get('#html')
      .contains('<h2 id="lorem-ipsum-text">Lorem Ipsum text</h2><div class="contents"><h3 class="contents__title">Содержание</h3><ul><li><a href="#lorem-ipsum-text">Lorem Ipsum text</a></li><li><a href="#lorem">Lorem</a></li><li><a href="#sed-sed-nulla">Sed sed nulla</a></li></ul></div><h3 id="lorem">Lorem</h3><p class="paragraph">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p><p class="paragraph">Pellentesque id mattis sem. Nam blandit massa mi.</p><h3 id="sed-sed-nulla">Sed sed nulla</h3><p class="paragraph">Sed sed nulla vitae risus iaculis tincidunt. Pellentesque convallis leo risus, vitae faucibus felis consectetur non.</p><p class="paragraph">Sed convallis elit quis orci volutpat, non accumsan elit commodo.</p>');
  });
});
