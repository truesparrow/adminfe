import 'mocha'

describe('Not found page', () => {
    before(() => {
        cy.clearOutData();
    });

    it('Should be a scaffold', () => {
        cy.visit('/inexistent-page', { failOnStatusCode: false });
        cy.get('main').contains('Could not find the page');
    });

    it('Web integration', () => {
        cy.visit('/inexistent-page', { failOnStatusCode: false });
        cy.title().should('equal', 'TruSpar - Page Not Found');
        cy.get('head > meta[name=description]').should('have.attr', 'content', 'Page not found');
    })
});
