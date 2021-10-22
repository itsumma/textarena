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
    cy.get('@example').then((example:any) => {
      cy.get('@root')
        .focus()
        .focused()
        .type('{selectall}')
        .type('{del}')
        .type('{alt+0}')
        .type('Test text.');

      cy.wait(100);
      cy.get('#html').contains('<p class="paragraph">Test text.</p>');

      cy.get('@root').click().focused().type('{selectall}');
      cy.get('.textarena-toolbar__list > :nth-child(2)').click();

      cy.wait(100);
      cy.get('#html').contains('<p class="paragraph"><em>Test text.</em></p>');

      cy.get('@root').click().focused().type('{selectall}');
      cy.get('.textarena-toolbar__item_active:first').click();

      cy.wait(100);
      cy.get('#html').contains('<p class="paragraph">Test text.</p>');
    });
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
    cy.wait(100);
    cy.get('#html')
      .contains('<p class="paragraph">Normal <strong>bold </strong><em>italic </em>normal2.</p>');
  });

  it('Blockqoute', () => {
    cy.get('@root')
      .focus()
      .type('{selectall}')
      .type('{del}')
      .type('{alt+"}')
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
      .type('{movetostart}')
      .type('{rightArrow}')
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
      .type('{movetostart}')
      .type('{rightArrow}')
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

  it('Headers', () => {
    cy.get('@root')
      .focus()
      .type('{selectall}')
      .type('{del}')
      .type('{alt+2}')
      .type('Header2')
      .type('{enter}')
      .type('Simple paragraph after header2')
      .type('{enter}')
      .type('{alt+3}')
      .type('Header3')
      .type('{enter}')
      .type('Simple paragraph after header3')
      .type('{enter}')
      .type('{alt+4}')
      .type('Header4')
      .type('{enter}')
      .type('Simple paragraph after header4')
      .type('{enter}')
      .type('Simple paragraph will be a header2')
      .type('{alt+2}');
    cy.wait(100);
    cy.get('#html')
      .contains('<h2>Header2</h2>')
      .contains('<p class="paragraph">Simple paragraph after header2</p>')
      .contains('<h3>Header3</h3>')
      .contains('<p class="paragraph">Simple paragraph after header3</p>')
      .contains('<h4>Header4</h4>')
      .contains('<p class="paragraph">Simple paragraph after header4</p>')
      .contains('<h2>Simple paragraph will be a header2</h2>');
  });

  it('Breaking', () => {
    cy.get('@example').then((example:any) => {
      cy.get('@root')
        .focus()
        .type('{selectall}')
        .type('{del}')
        .type('Single line text.')
        .type('{home}')
        .type('{rightArrow}{rightArrow}{rightArrow}{rightArrow}{rightArrow}{rightArrow}')
        .type('{enter}')
        .type('Two');

      cy.wait(100);
      cy.get('#html')
        .contains('<p class="paragraph">Single</p>')
        .contains('<p class="paragraph">Two line text.</p>');
    });
  });
});
