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
  it('Breaking', () => {
    cy.get('@root')
      .focus()
      .type('Single line text.')
      .type('{home}')
      .type('{rightArrow}{rightArrow}{rightArrow}{rightArrow}{rightArrow}{rightArrow}')
      .type('{enter}')
      .type('Two');

    cy.wait(10);
    cy.get('#html')
      .contains('<p class="paragraph">Single</p>')
      .contains('<p class="paragraph">Two line text.</p>');
  });
});
