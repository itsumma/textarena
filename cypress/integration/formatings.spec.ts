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

  it('Formatings', () => {
    cy.get('@root')
      .focus()
      .type('{selectall}')
      .type('{del}')
      .type('Normal ')
      .type(`{${ctrl}+b}`)
      .type('bold')
      .type(`{${ctrl}+b} `)
      .type(`{${ctrl}+i}`)
      .type('italic')
      .type(`{${ctrl}+i} `)
      .type(`{${ctrl}+u}`)
      .type('underlined')
      .type(`{${ctrl}+u} `)
      .type(`{${ctrl}+d}`)
      .type('strikethrough')
      .type(`{${ctrl}+d} `)
      .type(`{${ctrl}+,}`)
      .type('sub')
      .type(`{${ctrl}+,} `)
      .type(`{${ctrl}+p}`)
      .type('sup')
      .type(`{${ctrl}+p} `)
      .type(`{${ctrl}+h}`)
      .type('marked')
      .type(`{${ctrl}+h} `)
      .type(`{${ctrl}+e}`)
      .type('code')
      .type(`{${ctrl}+e} `)
      .type('normal2.')
      .get('#html')
      .contains(
        '<p class="paragraph">Normal <strong>bold</strong> <em>italic</em> <u>underlined</u> <s>strikethrough</s> <sub>sub</sub> <sup>sup</sup> <mark>marked</mark> <code>code</code> normal2.</p>',
      );
  });
});
