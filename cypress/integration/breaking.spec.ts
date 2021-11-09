/// <reference types="cypress" />

context('Actions', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080/');
    cy.get('.textarena-editor').focus();
    cy.get('.textarena-editor').as('root');

    cy.fixture('example.json').as('example');
  });
  it('Breaking', () => {
    cy.get('@root')
      .focus()
      .type('{selectall}')
      .type('{del}')
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
