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
  it('Block moving', () => {
    cy.get('@root')
      .focus()
      .type('Line 1')
      .type('{enter}')
      .type('Line 2')
      .type('{enter}')
      .type('Line 3')
      .type(`{shift+${isMac() ? 'ctrl' : 'alt'}+upArrow}`)
      .type('{upArrow}')
      .type(`{shift+${isMac() ? 'ctrl' : 'alt'}+downArrow}`)
      .type(`{shift+${isMac() ? 'ctrl' : 'alt'}+downArrow}`);
    cy.wait(10);
    cy.get('#html')
      .contains(
        '<p class="paragraph">Line 3</p><p class="paragraph">Line 2</p><p class="paragraph">Line 1</p>',
      );
  });
});
