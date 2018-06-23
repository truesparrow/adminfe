import 'mocha'


describe('Account page', () => {
    before(() => {
        cy.clearOutData();
    });

    it.only('Should be a scaffold', () => {
        cy.loginAsUser('user1.json').then(_ => {
            cy.visit('/admin/account');
            cy.clickSkip();
            cy.get('main').contains('Change the details about your account here');
        });
    });
});
