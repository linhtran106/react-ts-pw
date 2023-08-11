// enables intelligent code completion for Cypress commands
// https://on.cypress.io/intelligent-code-completion
/// <reference types="cypress" />

describe('Test home page', () => {
  const selectors = {
    logo: '.App-logo',
    description: '[data-cy="description"]',
    appLink: '.App-link'
  }

  beforeEach(() => {
    cy.visit('http://localhost:3000')
  })

  it('should has correct UI', function () {
    cy.log('** Verify HomePage is visible: Logo app & Description')
    cy.get(selectors.logo).should('be.visible')
    cy.get(selectors.description).should('be.visible')
  })

  it('navigate to React Document page', function () {
    cy.log('** Verify user is navigated to react.org successfully')
    cy.get(selectors.appLink).invoke('removeAttr', 'target').click()
    cy.url().should('eq', 'https://react.dev/')
  })
})
