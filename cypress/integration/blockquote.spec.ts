/// <reference types="cypress" />

import { isMac } from '../../src/utils/navigator';

const ctrl = isMac() ? 'cmd' : 'ctrl';

context('Actions', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080/');
    cy.get('.textarena-editor').focus();
    cy.get('.textarena-editor').as('root');
  });

  it('Blockqoute', () => {
    cy.get('@root')
      .focus()
      .type('{selectall}')
      .type('{del}')
      .type(`{${ctrl}+alt+"}`)
      .type('Blockqoute content')
      .type('{enter}')
      .type('{enter}')
      .type('Simple paragraph');

    cy.get('@root')
      .children('blockquote')
      .contains('p', 'Blockqoute content');

    cy.get('@root')
      .children()
      .eq(2)
      .contains('p', 'Simple paragraph');

    cy.get('@root')
      .focus()
      .type('{uparrow}{uparrow}{home}{rightarrow}') // In FF movetostart not working
      .type('First line.')
      .type('{enter}');

    cy.get('@root')
      .children('blockquote')
      .eq(0)
      .contains('p', 'First line.');

    cy.get('@root')
      .children('blockquote')
      .eq(0)
      .contains('p', 'Blockqoute content');

    cy.get('@root')
      .focus()
      .type('{uparrow}{uparrow}{home}{rightarrow}')
      .type('{end}')
      .type('{enter}')
      .type('{enter}');

    cy.get('@root')
      .children('blockquote')
      .eq(0)
      .contains('p', 'First line.');

    cy.get('@root')
      .children('blockquote')
      .eq(1)
      .contains('p', 'Blockqoute content');

    cy.get('@root')
      .children()
      .eq(4)
      .contains('p', 'Simple paragraph');
  });
});
