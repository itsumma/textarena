/// <reference types="cypress" />

context('Actions', () => {
  beforeEach(() => {
    cy.visit('http://0.0.0.0:8080/');
    cy.get('.textarena-editor').focus();
    cy.get('.textarena-editor').as('root');

    cy.fixture('example.json').as('example');
  });

  it('.type() - type into a DOM element', () => {
    cy.get('@example').then((example:any) => {
      cy.get('@root').focus().clear()
        .type('{alt+2}')
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

  it('break string', () => {
    cy.get('@example').then((example:any) => {
      cy.get('@root').focus().clear()
        .type('{alt+0}')
        .type(example.title)
        .type('{leftarrow}')
        .type('{leftarrow}')
        .type('{leftarrow}')
        .type('{enter}')
        .type('123');

      // cy.window()
      //   .its('ta.model.model.children.length')
      //   .should('equal', 2);
      cy.get('@root').contains(`123${example.title.slice(-3)}`);
      // cy.window()
      //   .its('ta.getData().content')
      //   .should('equal', 2);
      // cy.get('@root').contains(example.title);
      // cy.focused().should('equal', example.title.slice(-3));
      cy.get('@root')
        .type('{movetostart}')
        .type('{enter}')
        .type('456');
      cy.get('@root').contains(`456${example.title.slice(0, -3)}`);
    });
  });
});
