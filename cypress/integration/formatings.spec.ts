/// <reference types="cypress" />

import { isMac } from '../../src/utils/navigator';

const ctrl = isMac() ? 'cmd' : 'ctrl';

context('Actions', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080/');
    cy.get('.textarena-editor').focus();
    cy.get('.textarena-editor').as('root');

    cy.fixture('example.json').as('example');
  });

  it('Formatings', () => {
    cy.get('@root')
      .focus()
      .type('{selectall}')
      .type('{del}')
      .type('Normal ')
      .type(`{${ctrl}+b}`)
      .type('bold ')
      .type(`{${ctrl}+b}`)
      .type(`{${ctrl}+i}`)
      .type('italic ')
      .type(`{${ctrl}+i}`)
      .type('normal2.');
    cy.wait(10);
    cy.get('#html')
      .contains('<p class="paragraph">Normal <strong>bold </strong><em>italic </em>normal2.</p>');
  });
});
