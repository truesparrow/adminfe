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
});
