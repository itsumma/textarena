/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable<Subject> {
    addLink(text: string, url: string): Chainable<Subject>;
    selection<E extends Node = HTMLElement>(fn: (e: JQuery<E>) => void): Chainable<Subject>;
    setSelection(
      query: string,
      endQuery?: string,
    ): Chainable<Subject>;
  }
}
