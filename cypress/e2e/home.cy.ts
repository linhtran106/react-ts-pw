// enables intelligent code completion for Cypress commands
// https://on.cypress.io/intelligent-code-completion
/// <reference types="cypress" />

describe('Test home page', () => {
  const selectors = {
    pageHeader: '[data-cy="page-header"]',
  }

  beforeEach(() => {
    cy.visit('http://localhost:3000')
  })

  it('should has correct UI', function () {
    cy.get(selectors.pageHeader).should('be.visible')
  })
})
