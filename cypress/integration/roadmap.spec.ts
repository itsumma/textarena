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

  it('Roadmap with shortcut', () => {
    cy
      .get('@root')
      .focus()
      .type(`{${ctrl}+alt+2}`)
      .type('Roadmap with shortcut{enter}')
      .type('Formatting')
      .type(`{${ctrl}+alt+7}`)
      .type('{enter}')
      .type('Lists{enter}')
      .type('Embeds')
      .get('#html')
      .contains('<roadmap><p class="paragraph">Formatting</p><p class="paragraph">Lists</p><p class="paragraph">Embeds</p></roadmap>')
      .get('@root')
      .focus()
      .type('{upArrow}{enter}')
      .type('Complex blocks{enter}')
      .type('Tables')
      .get('#html')
      .contains('<roadmap><p class="paragraph">Formatting</p><p class="paragraph">Lists</p><p class="paragraph">Complex blocks</p><p class="paragraph">Tables</p><p class="paragraph">Embeds</p></roadmap>')
      .get('@root')
      .focus()
      .type('{upArrow}{end}{enter}{enter}')
      .type('A paragraph')
      .get('#html')
      .contains('<roadmap><p class="paragraph">Formatting</p><p class="paragraph">Lists</p><p class="paragraph">Complex blocks</p></roadmap><p class="paragraph">A paragraph</p><roadmap><p class="paragraph">Tables</p><p class="paragraph">Embeds</p></roadmap>');
  });

  it('Roadmap with creator bar', () => {
    cy
      .get('@root')
      .focus()
      .type(`{${ctrl}+alt+2}`)
      .type('Roadmap with creator bar{enter}')
      .wait(100)
      .get('.textarena-creator__create-button')
      .click()
      .wait(100)
      .get('.textarena-creator__list > :nth-child(13)')
      .click()
      .get('@root')
      .focus()
      .type('Formatting{enter}')
      .type('Lists{enter}')
      .type('Embeds')
      .get('#html')
      .contains('<roadmap><p class="paragraph">Formatting</p><p class="paragraph">Lists</p><p class="paragraph">Embeds</p></roadmap>')
      .get('@root')
      .setSelection('Lists')
      .type('{backspace}{backspace}{backspace}')
      .get('#html')
      .contains('<roadmap><p class="paragraph">Formatting</p><p class="paragraph">Embeds</p></roadmap>');
  });
});
