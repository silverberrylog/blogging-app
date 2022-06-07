/// <reference types="cypress" />

describe('Testing the /blog/create page', () => {
    describe('Saving a blog post to database', () => {
        it('Should parse and save a blog post', () => {
            cy.visit('/blog/create')

            cy.get('.input').type('Lorem ipsum')
            cy.get('.textarea').type('# Lorem ipsum')
            cy.get('.btn-primary').click()

            cy.url().should('eql', Cypress.config('baseUrl'))
            cy.get('.popup').should('exist')
        })
    })
})
