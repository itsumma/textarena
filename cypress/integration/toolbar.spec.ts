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

  it('Formatings toggle', () => {
    cy.get('@root')
      .focus()
      .focused()
      .type('Normal bold italic underlined strikethrough sub sup marked code normal2.')
      .get('#html')
      .contains('<p class="paragraph">Normal bold italic underlined strikethrough sub sup marked code normal2.</p>')
      .get('@root')
      .focus()
      .setSelection('bold')
      .get('.textarena-toolbar__list > :nth-child(1)')
      .click()
      .get('#html')
      .contains('<p class="paragraph">Normal <strong>bold</strong> italic underlined strikethrough sub sup marked code normal2.</p>')
      .get('@root')
      .focus()
      .setSelection('italic')
      .get('.textarena-toolbar__list > :nth-child(2)')
      .click()
      .get('#html')
      .contains('<p class="paragraph">Normal <strong>bold</strong> <em>italic</em> underlined strikethrough sub sup marked code normal2.</p>')
      .get('@root')
      .focus()
      .setSelection('underlined')
      .get('.textarena-toolbar__list > :nth-child(3)')
      .click()
      .get('#html')
      .contains('<p class="paragraph">Normal <strong>bold</strong> <em>italic</em> <u>underlined</u> strikethrough sub sup marked code normal2.</p>')
      .get('@root')
      .focus()
      .setSelection('strikethrough')
      .get('.textarena-toolbar__list > :nth-child(4)')
      .click()
      .get('#html')
      .contains('<p class="paragraph">Normal <strong>bold</strong> <em>italic</em> <u>underlined</u> <s>strikethrough</s> sub sup marked code normal2.</p>')
      .get('@root')
      .focus()
      .setSelection('sub')
      .get('.textarena-toolbar__list > :nth-child(5)')
      .click()
      .get('#html')
      .contains('<p class="paragraph">Normal <strong>bold</strong> <em>italic</em> <u>underlined</u> <s>strikethrough</s> <sub>sub</sub> sup marked code normal2.</p>')
      .get('@root')
      .focus()
      .setSelection('sup')
      .get('.textarena-toolbar__list > :nth-child(6)')
      .click()
      .get('#html')
      .contains('<p class="paragraph">Normal <strong>bold</strong> <em>italic</em> <u>underlined</u> <s>strikethrough</s> <sub>sub</sub> <sup>sup</sup> marked code normal2.</p>')
      .get('@root')
      .focus()
      .setSelection('marked')
      .get('.textarena-toolbar__list > :nth-child(7)')
      .click()
      .get('#html')
      .contains('<p class="paragraph">Normal <strong>bold</strong> <em>italic</em> <u>underlined</u> <s>strikethrough</s> <sub>sub</sub> <sup>sup</sup> <mark>marked</mark> code normal2.</p>')
      .get('@root')
      .focus()
      .setSelection('code')
      .get('.textarena-toolbar__list > :nth-child(8)')
      .click()
      .get('#html')
      .contains('<p class="paragraph">Normal <strong>bold</strong> <em>italic</em> <u>underlined</u> <s>strikethrough</s> <sub>sub</sub> <sup>sup</sup> <mark>marked</mark> <code>code</code> normal2.</p>')
      .get('@root')
      .focus()
      .setSelection('bold')
      .get('.textarena-toolbar__item_active:first')
      .click()
      .get('#html')
      .contains('<p class="paragraph">Normal bold <em>italic</em> <u>underlined</u> <s>strikethrough</s> <sub>sub</sub> <sup>sup</sup> <mark>marked</mark> <code>code</code> normal2.</p>')
      .get('@root')
      .focus()
      .setSelection('italic')
      .get('.textarena-toolbar__item_active:first')
      .click()
      .get('#html')
      .contains('<p class="paragraph">Normal bold italic <u>underlined</u> <s>strikethrough</s> <sub>sub</sub> <sup>sup</sup> <mark>marked</mark> <code>code</code> normal2.</p>')
      .get('@root')
      .focus()
      .setSelection('underlined')
      .get('.textarena-toolbar__item_active:first')
      .click()
      .get('#html')
      .contains('<p class="paragraph">Normal bold italic underlined <s>strikethrough</s> <sub>sub</sub> <sup>sup</sup> <mark>marked</mark> <code>code</code> normal2.</p>')
      .get('@root')
      .focus()
      .setSelection('strikethrough')
      .get('.textarena-toolbar__item_active:first')
      .click()
      .get('#html')
      .contains('<p class="paragraph">Normal bold italic underlined strikethrough <sub>sub</sub> <sup>sup</sup> <mark>marked</mark> <code>code</code> normal2.</p>')
      .get('@root')
      .focus()
      .setSelection('sub')
      .get('.textarena-toolbar__item_active:first')
      .click()
      .get('#html')
      .contains('<p class="paragraph">Normal bold italic underlined strikethrough sub <sup>sup</sup> <mark>marked</mark> <code>code</code> normal2.</p>')
      .get('@root')
      .focus()
      .setSelection('sup')
      .get('.textarena-toolbar__item_active:first')
      .click()
      .get('#html')
      .contains('<p class="paragraph">Normal bold italic underlined strikethrough sub sup <mark>marked</mark> <code>code</code> normal2.</p>')
      .get('@root')
      .focus()
      .setSelection('marked')
      .get('.textarena-toolbar__item_active:first')
      .click()
      .get('#html')
      .contains('<p class="paragraph">Normal bold italic underlined strikethrough sub sup marked <code>code</code> normal2.</p>')
      .get('@root')
      .focus()
      .setSelection('code')
      .get('.textarena-toolbar__item_active:first')
      .click()
      .get('#html')
      .contains('<p class="paragraph">Normal bold italic underlined strikethrough sub sup marked code normal2.</p>');
  });

  it('Headings', () => {
    cy.get('@root')
      .focus()
      .type('Header2')
      .setSelection('Header2')
      .get('.textarena-toolbar__list > :nth-child(10)')
      .click()
      .get('#html')
      .contains('<h2 id="header2">Header2</h2>')
      .get('@root')
      .focus()
      .type('{rightArrow}{enter}')
      .type('Header3')
      .setSelection('Header3')
      .get('.textarena-toolbar__list > :nth-child(11)')
      .click()
      .get('#html')
      .contains('<h3 id="header3">Header3</h3>')
      .get('@root')
      .focus()
      .type('{rightArrow}{enter}')
      .type('Header4')
      .setSelection('Header4')
      .get('.textarena-toolbar__list > :nth-child(12)')
      .click()
      .get('#html')
      .contains('<h4 id="header4">Header4</h4>')
      .get('.textarena-toolbar__item_active:first')
      .click()
      .get('#html')
      .contains('<p class="paragraph">Header4</p>')
      .get('@root')
      .focus()
      .setSelection('Header3')
      .get('.textarena-toolbar__item_active:first')
      .click()
      .get('#html')
      .contains('<p class="paragraph">Header3</p>')
      .get('@root')
      .focus()
      .setSelection('Header2')
      .get('.textarena-toolbar__item_active:first')
      .click()
      .get('#html')
      .contains('<p class="paragraph">Header2</p>');
  });

  it('Ctrl shortcuts hints', () => {
    cy.get('@root')
      .focus()
      .focused()
      .type('Test text.')
      .type('{selectAll}')
      .type(`{${ctrl}}`, { release: false })
      .get('.textarena-toolbar__list > :nth-child(1) > .textarena-shortcut-hint-short')
      .then(($el) => {
        assert.isTrue(Cypress.dom.isVisible($el));
      });
  });

  it('Ctrl + Alt shortcuts hints', () => {
    cy.get('@root')
      .focus()
      .focused()
      .type('Test text.')
      .type('{selectAll}')
      .type(`{${ctrl}}`, { release: false })
      .type('{alt}', { release: false })
      .get('.textarena-toolbar__list > :nth-child(10) > .textarena-shortcut-hint-short')
      .then(($el) => {
        assert.isTrue(Cypress.dom.isVisible($el));
      });
  });
});
