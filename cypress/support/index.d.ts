/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable<Subject> {
    selection<E extends Node = HTMLElement>(fn: (e: JQuery<E>) => void): Chainable<Subject>;
    setSelection(
      query: string,
      endQuery?: string,
    ): Chainable<Subject>;
  }
}
