/// <reference types="cypress" />

context('Actions', () => {
  beforeEach(() => {
    cy.visit('http://0.0.0.0:8080/');
    cy.get('.textarena-editor').focus().clear().clear();
    cy.get('.textarena-editor').as('root');

    cy.fixture('example.json').as('example');
  });

  it('.type() - type into a DOM element', () => {
    cy.get('@example').then((example:any) => {
      cy.get('@root').focus().clear()
        .type(example.title);

      cy.get('@root').click().focused().type('{selectall}');
      cy.get('.textarena-toolbar__list > :nth-child(2)').click();
      cy.get('@root').click().focused().type('{selectall}');
      cy.get('.textarena-toolbar__list > :nth-child(3)').click();
      cy.get('@root').contains(example.title);
      cy.get('#html').contains('<h2>');
      cy.get('#html').contains('<em>');
    });
  });
});
