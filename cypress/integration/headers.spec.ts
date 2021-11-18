/// <reference types="cypress" />

import { isMac } from '../../src/utils/navigator';

const ctrl = isMac() ? 'cmd' : 'ctrl';

context('Actions', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080/');
    cy.get('.textarena-editor')
      .as('root')
      .focus()
      .type('{selectall}')
      .type('{del}');
  });

  it('Headers with shortcuts', () => {
    cy.get('@root')
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
      .type(`{${ctrl}+alt+2}`)
      .get('#html')
      .contains('<h2 id="header2">Header2</h2><p class="paragraph">Simple paragraph after header2</p><h3 id="header3">Header3</h3><p class="paragraph">Simple paragraph after header3</p><h4 id="header4">Header4</h4><p class="paragraph">Simple paragraph after header4</p><h2 id="simple-paragraph-will-be-a-header2">Simple paragraph will be a header2</h2>')
      .get('@root')
      .focus()
      .focused()
      .type(`{${ctrl}+alt+2}`)
      .type(`{upArrow}{upArrow}{${ctrl}+alt+4}`)
      .type(`{upArrow}{upArrow}{${ctrl}+alt+3}`)
      .type(`{upArrow}{upArrow}{${ctrl}+alt+2}`)
      .get('#html')
      .contains('<p class="paragraph">Header2</p><p class="paragraph">Simple paragraph after header2</p><p class="paragraph">Header3</p><p class="paragraph">Simple paragraph after header3</p><p class="paragraph">Header4</p><p class="paragraph">Simple paragraph after header4</p><p class="paragraph">Simple paragraph will be a header2</p>');
  });

  it('Headers with creator bar', () => {
    cy.get('@root')
      .get('.textarena-creator__create-button')
      .click()
      .wait(100)
      .get('.textarena-creator__list > :nth-child(1)')
      .click()
      .get('@root')
      .focus()
      .focused()
      .type('Header2{enter}')
      .type('Simple paragraph after header2{enter}')
      .get('.textarena-creator__create-button')
      .click()
      .wait(100)
      .get('.textarena-creator__list > :nth-child(2)')
      .click()
      .get('@root')
      .focus()
      .focused()
      .type('Header3{enter}')
      .type('Simple paragraph after header3{enter}')
      .get('.textarena-creator__create-button')
      .click()
      .wait(100)
      .get('.textarena-creator__list > :nth-child(3)')
      .click()
      .get('@root')
      .focus()
      .focused()
      .type('Header4{enter}')
      .type('Simple paragraph after header4{enter}')
      .get('#html')
      .contains('<h2 id="header2">Header2</h2><p class="paragraph">Simple paragraph after header2</p><h3 id="header3">Header3</h3><p class="paragraph">Simple paragraph after header3</p><h4 id="header4">Header4</h4><p class="paragraph">Simple paragraph after header4</p>');
  });
});
