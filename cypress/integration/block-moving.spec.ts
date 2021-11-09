/// <reference types="cypress" />

import { isMac } from '../../src/utils/navigator';

context('Actions', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080/');
    cy.get('.textarena-editor').focus();
    cy.get('.textarena-editor').as('root');

    cy.fixture('example.json').as('example');
  });
  it('Block moving', () => {
    cy.get('@root')
      .focus()
      .type('{selectall}')
      .type('{del}')
      .type('Line 1')
      .type('{enter}')
      .type('Line 2')
      .type('{enter}')
      .type('Line 3')
      .type(`{shift+${isMac() ? 'ctrl' : 'alt'}+uparrow}`)
      .type('{uparrow}')
      .type(`{shift+${isMac() ? 'ctrl' : 'alt'}+downarrow}`)
      .type(`{shift+${isMac() ? 'ctrl' : 'alt'}+downarrow}`);
    cy.wait(10);
    cy.get('#html')
      .contains(
        '<p class="paragraph">Line 3</p><p class="paragraph">Line 2</p><p class="paragraph">Line 1</p>',
      );
  });
});
