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

  it('*** Separator', () => {
    cy.get('@root')
      .focus()
      .type('Text before separator{enter}')
      .type(`{${ctrl}+alt+H}`)
      .get('#html')
      .contains('<p class="paragraph">Text before separator</p><hr contenteditable="false" class="asterisk"></hr>')
      .get('@root')
      .focus()
      .type('{backspace}{backspace}')
      .get('#html')
      .contains('<p class="paragraph">Text before separator</p>')
      .get('@root')
      .focus()
      .type('{enter}')
      .wait(100)
      .get('.textarena-creator__create-button')
      .click()
      .wait(100)
      .get('.textarena-creator__list > :nth-child(6)')
      .click()
      .get('@root')
      .focus()
      .type('Text after separator')
      .get('#html')
      .contains('<p class="paragraph">Text before separator</p><hr contenteditable="false" class="asterisk"></hr><p class="paragraph">Text after separator</p>');
  });
});
