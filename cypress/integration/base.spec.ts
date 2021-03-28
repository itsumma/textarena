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
      cy.get('@root')
        .focus()
        .focused()
        .type('{selectall}')
        .type('{del}')
        .type('{alt+2}')
        .type('Test title');

      cy.get('@root').click().focused().type('{selectall}');
      cy.get('.textarena-toolbar__list > :nth-child(2)').click();
      cy.get('@root').click().focused().type('{selectall}');
      cy.get('.textarena-toolbar__list > :nth-child(3)').click();
      cy.get('@root').contains('Test title');
      cy.get('#html').contains('<h2>');
      cy.wait(500);
      cy.get('#html').contains('<em><u>Test title</u></em>');
    });
  });

  it('break string', () => {
    cy.get('@example').then((example:any) => {
      cy.get('@root')
        .focus()
        .type('{selectall}')
        .type('{del}')
        .type('Test title')
        .type('{leftarrow}')
        .type('{leftarrow}')
        .type('{leftarrow}')
        .type('{enter}')
        .type('123');

      // cy.window()
      //   .its('ta.model.model.children.length')
      //   .should('equal', 2);
      cy.get('@root').contains('Test ti123tle');
      // cy.window()
      //   .its('ta.getData().content')
      //   .should('equal', 2);
      // cy.get('@root').contains(example.title);
      // cy.focused().should('equal', example.title.slice(-3));
      cy.get('@root')
        .type('{movetostart}')
        .type('{enter}')
        .type('456');
      cy.get('@root').contains('456Test ti123tle');
    });
  });
});
