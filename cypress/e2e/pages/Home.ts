import { emptyFirestoreEmulator } from '#/utils'
import { createBlog } from '@/utils/blogs'

describe('Testing the / page', () => {
    describe('Querying blog posts, showing oldest first', () => {
        it("Should not show blog posts when there aren't any", () => {
            emptyFirestoreEmulator()

            cy.visit('/')

            cy.contains('no results').should('exist')
            cy.get('.blog-posts').children().should('have.length', 0)
            cy.contains('Next page').should('be.disabled')
        })

        it('Should show no blog posts when the page is empty ', () => {
            emptyFirestoreEmulator()
            cy.wrap(null).then(() =>
                createBlog('# Lorem ipsum', 'Lorem ipsum #0')
            )

            cy.visit('/')
            cy.get('.blog-posts').children().should('have.length', 1)
            cy.contains('Previous page').click()

            cy.contains('no results').should('exist')
            cy.get('.blog-posts').children().should('have.length', 0)
            cy.contains('Previous page').should('be.disabled')
        })

        it('Should show blog posts when there less than 10 of them ', () => {
            emptyFirestoreEmulator()
            for (let i = 0; i < 5; i++) {
                cy.wrap(null).then(() =>
                    createBlog('# Lorem ipsum', 'Lorem ipsum #' + i)
                )
            }

            cy.visit('/')

            cy.get('.blog-posts').children().should('have.length', 5)
            cy.contains('Next page').should('be.disabled')
        })

        it('Should show blog posts when there are more than 10 of them ', () => {
            emptyFirestoreEmulator()
            for (let i = 0; i < 12; i++) {
                cy.wrap(null).then(() =>
                    createBlog('# Lorem ipsum', 'Lorem ipsum #' + i)
                )
            }

            cy.visit('/')

            cy.get('.blog-posts').children().should('have.length', 10)
        })
    })
})
