import 'mocha'

describe('Not found page', () => {
    before(() => {
        cy.clearOutData();
    });

    it('Should be a scaffold', () => {
        cy.visit('/inexistent-page', { failOnStatusCode: false });
        cy.get('main').contains('Could not find the page');
    });
});
