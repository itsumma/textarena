/// <reference types="cypress" />
import { isMac } from '../../src/utils/navigator';

const url = 'https://github.com/itsumma/textarena';

const ctrl = isMac() ? 'cmd' : 'ctrl';

context('Actions', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080/');
    cy.get('.textarena-editor').focus();
    cy.get('.textarena-editor').as('root');

    cy.fixture('example.json').as('example');
    cy.get('@root')
      .focus()
      .type('{selectall}')
      .type('{del}');
  });

  it('Keyboard shortcut link', () => {
    cy.get('@root')
      .focus()
      .type('Textarena is awesome!')
      .addLink('Textarena', url)
      .get('#html')
      .contains(`<a href="${url}" target="_blank">Textarena</a>`);
  });

  it('Toolbar item click link', () => {
    cy.get('@root')
      .focus()
      .type('Textarena')
      .type('{selectall}')
      .get('.textarena-toolbar__list > :nth-child(9)')
      .click()
      .get('input#url', { includeShadowDom: true })
      .type(`${url}{enter}`, { force: true, waitForAnimations: false })
      .get('#html')
      .contains(`<a href="${url}" target="_blank">Textarena</a>`);
  });

  it('Edit link with shortcut', () => {
    const itsummaUrl = 'https://itsumma.ru';
    cy.get('@root')
      .focus()
      .type('Textarena is awesome!')
      .addLink('Textarena', url)
      .get('#html')
      .contains(`<a href="${url}" target="_blank">Textarena</a>`)
      .get('@root')
      .type(`{home}{${ctrl}+k}`)
      .get('input#text', { includeShadowDom: true })
      .type('{selectall}{backspace}ITSumma', { force: true, waitForAnimations: false })
      .get('input#url', { includeShadowDom: true })
      .type(`{selectall}{backspace}${itsummaUrl}{enter}`, { force: true, waitForAnimations: false })
      .get('#html')
      .contains(`<a href="${itsummaUrl}" target="_blank">ITSumma</a>`);
  });

  it('Edit link with link bar', () => {
    const itsummaUrl = 'https://itsumma.ru';
    cy.get('@root')
      .focus()
      .type('Textarena is awesome!')
      .addLink('Textarena', url)
      .get('#html')
      .contains(`<a href="${url}" target="_blank">Textarena</a>`)
      .get('@root')
      .type('{home}')
      .get('.textarena-linkbar')
      .shadow()
      .find('.link  > :nth-child(2)')
      .click()
      .get('input#url', { includeShadowDom: true })
      .type(`{selectall}{backspace}${itsummaUrl}{enter}`, { force: true, waitForAnimations: false })
      .get('#html')
      .contains(`<a href="${itsummaUrl}" target="_blank">Textarena</a>`);
  });

  it('Copy link with link bar', () => {
    cy.get('@root')
      .focus()
      .type('Textarena is awesome!')
      .addLink('Textarena', url)
      .get('#html')
      .contains(`<a href="${url}" target="_blank">Textarena</a>`)
      .get('@root')
      .type('{home}')
      .get('.textarena-linkbar')
      .shadow()
      .find('.link  > :nth-child(3)')
      .click()
      .window()
      .its('navigator.clipboard')
      .invoke('readText')
      .should('equal', url);
  });

  it('Disable link', () => {
    cy.get('@root')
      .focus()
      .type('Textarena is awesome!')
      .addLink('Textarena', url)
      .get('#html')
      .contains(`<a href="${url}" target="_blank">Textarena</a>`)
      .get('@root')
      .type('{home}')
      .get('.textarena-linkbar')
      .shadow()
      .find('.link  > :nth-child(4)')
      .click()
      .get('@root')
      .contains('Textarena is awesome!');
  });

  it('Disable target attribute', () => {
    cy.get('@root')
      .focus()
      .type('Textarena is awesome!')
      .addLink('Textarena', url)
      .get('#html')
      .contains(`<a href="${url}" target="_blank">Textarena</a>`)
      .get('@root')
      .type('{home}')
      .get('.textarena-linkbar')
      .shadow()
      .find('.link  > :nth-child(5)')
      .click()
      .get('#html')
      .contains(`<a href="${url}">Textarena</a>`);
  });

  it('Close link modal on Escape', () => {
    cy.get('@root')
      .focus()
      .type('Textarena is awesome!')
      .setSelection('Textarena')
      .type(`{${ctrl}+k}`)
      .get('.textarena-link-modal')
      .shadow()
      .find('.wrapper')
      .then(($el) => {
        assert.isTrue(Cypress.dom.isVisible($el));
      })
      .get('input#url', { includeShadowDom: true })
      .type('{esc}', { force: true, waitForAnimations: false })
      .get('.textarena-link-modal')
      .shadow()
      .find('.wrapper')
      .then(($el) => {
        assert.isFalse(Cypress.dom.isVisible($el));
      });
  });

  it('Close link modal on button close click', () => {
    cy.get('@root')
      .focus()
      .type('Textarena is awesome!')
      .setSelection('Textarena')
      .type(`{${ctrl}+k}`)
      .get('.textarena-link-modal')
      .shadow()
      .find('.wrapper')
      .then(($el) => {
        assert.isTrue(Cypress.dom.isVisible($el));
      })
      .get('.textarena-link-modal')
      .shadow()
      .find('button.close')
      .click()
      .get('.textarena-link-modal')
      .shadow()
      .find('.wrapper')
      .then(($el) => {
        assert.isFalse(Cypress.dom.isVisible($el));
      });
  });

  it('Close link modal on click', () => {
    cy.get('@root')
      .focus()
      .type('Textarena is awesome!')
      .setSelection('Textarena')
      .type(`{${ctrl}+k}`)
      .get('.textarena-link-modal')
      .shadow()
      .find('.wrapper')
      .then(($el) => {
        assert.isTrue(Cypress.dom.isVisible($el));
      })
      .get('.textarena-link-modal')
      .shadow()
      .find('.wrapper')
      .click()
      .get('.textarena-link-modal')
      .shadow()
      .find('.wrapper')
      .then(($el) => {
        assert.isFalse(Cypress.dom.isVisible($el));
      });
  });
});
