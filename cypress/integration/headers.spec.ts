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
  it('Headers', () => {
    cy.get('@root')
      .focus()
      .type('{selectall}')
      .type('{del}')
      .type(`{${ctrl}+alt+2}`)
      .type('Header2')
      .type('{enter}')
      .type('Simple paragraph after header2')
      .type('{enter}')
      .type(`{${ctrl}+alt+3}`)
      .type('Header3')
      .type('{enter}')
      .type('Simple paragraph after header3')
      .type('{enter}')
      .type(`{${ctrl}+alt+4}`)
      .type('Header4')
      .type('{enter}')
      .type('Simple paragraph after header4')
      .type('{enter}')
      .type('Simple paragraph will be a header2')
      .type(`{${ctrl}+alt+2}`);
    cy.wait(10);
    cy.get('#html')
      .contains(/<h2[^>]*>Header2<\/h2>/)
      .contains('<p class="paragraph">Simple paragraph after header2</p>')
      .contains(/<h3[^>]*>Header3<\/h3>/)
      .contains('<p class="paragraph">Simple paragraph after header3</p>')
      .contains(/<h4[^>]*>Header4<\/h4>/)
      .contains('<p class="paragraph">Simple paragraph after header4</p>')
      .contains(/<h2[^>]*>Simple paragraph will be a header2<\/h2>/);
  });
});
