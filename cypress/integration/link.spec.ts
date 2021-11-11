/// <reference types="cypress" />
import { isMac } from '../../src/utils/navigator';

const ctrl = isMac() ? 'cmd' : 'ctrl';

const url = 'https://github.com/itsumma/textarena';

context('Actions', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080/');
    cy.get('.textarena-editor').focus();
    cy.get('.textarena-editor').as('root');

    cy.fixture('example.json').as('example');
  });
  it('Keyboard shortcut link', () => {
    cy.get('@root')
      .focus()
      .type('{selectall}')
      .type('{del}')
      .type('Textarena is awesome!')
      .setSelection('Textarena')
      .type(`{${ctrl}+k}`)
      .get('input#url', { includeShadowDom: true })
      .type(`${url}{enter}`, { force: true, waitForAnimations: false })
      .get('#html')
      .contains(`<a href="${url}" target="_blank">Textarena</a>`);
  });
});
