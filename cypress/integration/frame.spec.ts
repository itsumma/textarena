/// <reference types="cypress" />

import { isMac } from '../../src/utils/navigator';

const ctrl = isMac() ? 'cmd' : 'ctrl';

context('Actions', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080/');
    cy
      .get('.textarena-editor')
      .as('root')
      .focus()
      .type('{selectAll}')
      .type('{del}')
      .type(`{${ctrl}+/}`);
  });

  it('Frame with multiple elements', () => {
    cy
      .wait(100)
      .get('.textarena-creator__create-button')
      .click()
      .wait(100)
      .get('.textarena-creator__list > :nth-child(1)')
      .click()
      .get('@root')
      .focus()
      .type('Testing frames{enter}')
      .get('.textarena-creator__create-button')
      .click()
      .wait(100)
      .get('.textarena-creator__list > :nth-child(11)')
      .click()
      .get('@root')
      .focus()
      .type(`{${ctrl}+alt+2}`)
      .type('Paragraph{enter}')
      .type('A simple paragraph inside a frame{enter}')
      .wait(100)
      .get('.textarena-creator__create-button')
      .click()
      .wait(100)
      .get('.textarena-creator__list > :nth-child(2)') // columns
      .click()
      .get('@root')
      .focus()
      .type('Two columns{enter}')
      .type(`{${ctrl}+alt+6}`)
      .get('@root')
      .setSelection('Two columns')
      .type('{end}{rightArrow}')
      .type(`{${ctrl}+alt+3}`)
      .type('Unordered list{enter}')
      .type(`{${ctrl}+alt+L}`)
      .type('item{enter}')
      .type('another item{rightArrow}')
      .wait(100)
      .get('.textarena-creator__create-button')
      .click()
      .wait(100)
      .get('.textarena-creator__list > :nth-child(2)')
      .click()
      .get('@root')
      .focus()
      .type('Ordered list{enter}')
      .type(`{${ctrl}+alt+O}`)
      .type('first{enter}')
      .type('second{enter}')
      .type('third{enter}')
      .type('{backspace}') // Finish columns
      .type('{backspace}') // Finish list
      .type('{downArrow}{downArrow}') // Move cursor to the bottom of frame
      .type('{backspace}{backspace}') // Finish first frame
      .type(`{${ctrl}+alt+3}`)
      .type('Second frame{enter}')
      .type(`{${ctrl}+alt+5}`)
      .type(`{${ctrl}+alt+3}`)
      .type('Text with separator{enter}')
      .type('A simple paragraph{enter}')
      .wait(100)
      .get('.textarena-creator__create-button')
      .click()
      .wait(100)
      .get('.textarena-creator__list > :nth-child(6)')
      .click()
      .get('@root')
      .focus()
      .type('Text after separator{enter}')
      .type(`{${ctrl}+alt+3}`)
      .type('Roadmap{enter}')
      .type(`{${ctrl}+alt+7}`)
      .type('Tables{enter}')
      .type('Attributes{enter}')
      .type('Complex elements{upArrow}{upArrow}{upArrow}{home}')
      .type('{backspace}') // Split frame
      .get('@root')
      .setSelection('Roadmap')
      .type('{end} in a frame')
      .type(`{${ctrl}+alt+3}`)
      .get('#html')
      .contains('<h2 id="testing-frames">Testing frames</h2><aside class="aside aside-gray"><h2 id="paragraph">Paragraph</h2><p class="paragraph">A simple paragraph inside a frame</p><h3 id="two-columns">Two columns</h3><div class="arena-two-col"><div class="arena-col"><h3 id="unordered-list">Unordered list</h3><ul><li>item</li><li>another item</li></ul></div><div class="arena-col"><h3 id="ordered-list">Ordered list</h3><ol><li>first</li><li>second</li><li>third</li></ol></div></div></aside><h3 id="second-frame">Second frame</h3><aside class="aside aside-gray"><h3 id="text-with-separator">Text with separator</h3><p class="paragraph">A simple paragraph</p><hr contenteditable="false" class="asterisk"></hr><p class="paragraph">Text after separator</p></aside><h3 id="roadmap-in-a-frame">Roadmap in a frame</h3><aside class="aside aside-gray"><roadmap><p class="paragraph">Tables</p><p class="paragraph">Attributes</p><p class="paragraph">Complex elements</p></roadmap></aside>');
  });
});
