/// <reference types="cypress" />

import { isMac } from '../../src/utils/navigator';

const ctrl = isMac() ? 'cmd' : 'ctrl';

context('Actions', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080/');
    cy
      .get('.textarena-editor')
      .as('root')
      .focus()
      .type('{selectAll}')
      .type('{del}')
      .type(`{${ctrl}+/}`);
  });

  it('Nested unordered lists', () => {
    cy.get('@root')
      .focus()
      .type('First item')
      .type(`{alt+${ctrl}+L}{enter}`)
      .tab()
      .get('@root')
      .focus()
      .focused()
      .type('Second item')
      .type('{enter}')
      .tab()
      .get('@root')
      .focus()
      .focused()
      .type('Third item')
      .type('{enter}')
      .tab({ shift: true })
      .get('@root')
      .focus()
      .focused()
      .type('Fourth item')
      .type('{enter}')
      .tab({ shift: true })
      .get('@root')
      .focus()
      .focused()
      .type('Fifth item')
      .get('#html')
      .contains('<ul><li>First item</li><ul><li>Second item</li><ul><li>Third item</li></ul><li>Fourth item</li></ul><li>Fifth item</li></ul>');
  });

  it('Nested ordered lists', () => {
    cy.get('@root')
      .focus()
      .type('First item')
      .type(`{alt+${ctrl}+O}{enter}`)
      .tab()
      .get('@root')
      .focus()
      .focused()
      .type('a item')
      .type('{enter}')
      .tab()
      .get('@root')
      .focus()
      .focused()
      .type('i item')
      .type('{enter}')
      .type('ii item')
      .type('{enter}')
      .tab({ shift: true })
      .get('@root')
      .focus()
      .focused()
      .type('b item')
      .type('{enter}')
      .tab({ shift: true })
      .get('@root')
      .focus()
      .focused()
      .type('Second item')
      .get('#html')
      .contains('<ol><li>First item</li><ol><li>a item</li><ol><li>i item</li><li>ii item</li></ol><li>b item</li></ol><li>Second item</li></ol>');
  });

  it('Convert to unordered list', () => {
    cy.get('@root')
      .focus()
      .type('First item{enter}')
      .type('Second item{enter}')
      .type('Third item{selectAll}')
      .wait(100)
      .get('.textarena-toolbar__list > :nth-child(13)')
      .click()
      .get('#html')
      .contains('<ul><li>First item</li><li>Second item</li><li>Third item</li></ul>')
      .get('@root')
      .focus()
      .type('{selectAll}')
      .wait(100)
      .get('.textarena-toolbar__list > :nth-child(13)')
      .click()
      .get('#html')
      .contains('<p class="paragraph">First item</p><p class="paragraph">Second item</p><p class="paragraph">Third item</p>');
  });

  it('Convert to ordered list', () => {
    cy.get('@root')
      .focus()
      .type('First item{enter}')
      .type('Second item{enter}')
      .type('Third item{selectAll}')
      .wait(100)
      .get('.textarena-toolbar__list > :nth-child(14)')
      .click()
      .get('#html')
      .contains('<ol><li>First item</li><li>Second item</li><li>Third item</li></ol>')
      .get('@root')
      .focus()
      .type('{selectAll}')
      .wait(100)
      .get('.textarena-toolbar__list > :nth-child(14)')
      .click()
      .get('#html')
      .contains('<p class="paragraph">First item</p><p class="paragraph">Second item</p><p class="paragraph">Third item</p>');
  });
});
