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

  it('Toolbar', () => {
    cy.get('@root')
      .focus()
      .focused()
      .type('{selectall}')
      .type('{del}')
      .type(`{${ctrl}+alt+0}`)
      .type('Test text.');

    cy.wait(10);
    cy.get('#html').contains('<p class="paragraph">Test text.</p>');

    cy.get('@root').click().focused().type('{selectall}');
    cy.get('.textarena-toolbar__list > :nth-child(2)').click();

    cy.wait(10);
    cy.get('#html').contains('<p class="paragraph"><em>Test text.</em></p>');

    cy.get('@root').click().focused().type('{selectall}');
    cy.get('.textarena-toolbar__item_active:first').click();

    cy.wait(10);
    cy.get('#html').contains('<p class="paragraph">Test text.</p>');
  });
});
