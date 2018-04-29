import 'mocha'


describe('Account page', () => {
    before(() => {
        cy.clearOutData();
    });

    it('Should be a scaffold', () => {
        cy.loginAsUser('user1.json').then(_ => {
            cy.visit('/admin/account');
            cy.get('main').contains('Account page');
        });
    });

    it('Web integration', () => {
        cy.loginAsUser('user1.json').then(_ => {
            cy.visit('/admin/account');
            cy.title().should('equal', 'TruSpar - Account');
            cy.get('head > meta[name=description]').should('have.attr', 'content', 'Account administration page');
        });
    })
});
