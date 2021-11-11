/* eslint-disable @typescript-eslint/no-explicit-any */
/// <reference types="../support"/>
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

/**
 * From https://github.com/netlify/netlify-cms/blob/a4b7481a99f58b9abe85ab5712d27593cde20096/cypress/support/commands.js
 */

import { isMac } from '../../src/utils/navigator';

const ctrl = isMac() ? 'cmd' : 'ctrl';

function getTextNode(el: HTMLElement, match?: string): Text | null {
  const walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
  if (!match) {
    return walk.nextNode() as Text;
  }

  let node;
  // eslint-disable-next-line no-cond-assign
  while ((node = walk.nextNode())) {
    if ((node as Text).wholeText.indexOf(match) >= 0) {
      return node as Text;
    }
  }
  return null;
}

function setBaseAndExtent(...args: [Node, number, Node, number]) {
  const document = args[0].ownerDocument;
  document?.getSelection()?.removeAllRanges();
  document?.getSelection()?.setBaseAndExtent(...args);
}

Cypress.Commands.add(
  'selection',
  { prevSubject: true },
  ((subject: any, fn: (e: JQuery) => void) => {
    cy.wrap(subject)
      .trigger('mousedown')
      .then(fn)
      .trigger('mouseup');

    cy.document().trigger('selectionchange');
    return cy.wrap(subject);
  }) as any,
);

Cypress.Commands.add('setSelection', { prevSubject: true }, ((subject: any, query: string, endQuery?: string) =>
  cy.wrap(subject).selection(($el: JQuery) => {
    const anchorNode = getTextNode($el[0], query);
    if (!anchorNode) return;
    const focusNode = endQuery ? getTextNode($el[0], endQuery) : anchorNode;
    if (!focusNode) return;
    const anchorOffset = anchorNode.wholeText.indexOf(query);
    const focusOffset = endQuery
      ? focusNode.wholeText.indexOf(endQuery) + endQuery.length
      : anchorOffset + query.length;
    setBaseAndExtent(anchorNode, anchorOffset, focusNode, focusOffset);
  })) as any);

Cypress.Commands.add('addLink', { prevSubject: true }, ((subject: any, text: string, url: string) =>
  cy
    .wrap(subject)
    .setSelection(text)
    .type(`{${ctrl}+k}`)
    .get('.textarena-link-modal')
    .shadow()
    .find('.wrapper')
    .then(($el) => {
      assert.isTrue(Cypress.dom.isVisible($el));
    })
    .get('input#url', { includeShadowDom: true })
    .type(`${url}{enter}`, { force: true, waitForAnimations: false })
    .get('.textarena-link-modal')
    .shadow()
    .find('.wrapper')
    .then(($el) => {
      assert.isFalse(Cypress.dom.isVisible($el));
    })) as any);
