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

  it('Blockquote', () => {
    cy.get('@root')
      .focus()
      .type(`{${ctrl}+alt+"}`)
      .type('Blockquote content')
      .type('{enter}')
      .type('{enter}')
      .type('Simple paragraph');

    cy.get('@root')
      .children('textarena-node')
      .children('blockquote')
      .contains('p', 'Blockquote content');

    cy.get('#html')
      .contains('<blockquote class="textarena-blockquote"><p class="paragraph">Blockquote content</p></blockquote><p class="paragraph">Simple paragraph</p>');

    cy.get('@root')
      .children()
      .eq(1)
      .contains('p', 'Simple paragraph');

    cy.get('@root')
      .focus()
      .type('{upArrow}{home}') // In FF movetostart not working
      .type('First line.')
      .type('{enter}');

    cy.get('@root')
      .children('textarena-node')
      .children('blockquote')
      .eq(0)
      .contains('p', 'First line.');

    cy.get('@root')
      .children('textarena-node')
      .children('blockquote')
      .eq(0)
      .contains('p', 'Blockquote content');

    cy.get('#html')
      .contains('<blockquote class="textarena-blockquote"><p class="paragraph">First line.</p><p class="paragraph">Blockquote content</p></blockquote><p class="paragraph">Simple paragraph</p>');

    cy.get('@root')
      .focus()
      .type('{upArrow}{upArrow}{home}{rightArrow}')
      .type('{end}')
      .type('{enter}')
      .type('{enter}');

    cy.get('@root')
      .children('textarena-node')
      .children('blockquote')
      .eq(0)
      .contains('p', 'First line.');

    cy.get('@root')
      .children('textarena-node')
      .eq(3)
      .get('@root')
      .get('textarena-node:nth-child(3) blockquote')
      .contains('p', 'Blockquote content');

    cy.get('@root')
      .children('textarena-node')
      .get('textarena-node:nth-child(4)')
      .contains('p', 'Simple paragraph');

    cy.get('#html')
      .contains('<blockquote class="textarena-blockquote"><p class="paragraph">First line.</p></blockquote><blockquote class="textarena-blockquote"><p class="paragraph">Blockquote content</p></blockquote><p class="paragraph">Simple paragraph</p>');
  });
});
