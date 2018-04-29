import 'mocha'


describe('Site page', () => {
    before(() => {
        cy.clearOutData();
    });

    it.skip('Allows changing DNS subdomain', () => {
        cy.loginAsUser('user1.json').then(_ => {
            cy.visit('/admin/site');

            cy.log('Edit the subdomain field');
            cy.get('main').get('span.subdomain-part-input').get('input').clear().type('special');
            cy.get('main').contains('Subdomain is currently available');

            cy.log('Click save and wait for it to be registered');
            cy.clickSave('DNS');

            cy.log('Check that we have the right data back');
            cy.visit('/admin/site');
            cy.get('main').get('span.subdomain-part-input').get('input').should('have.attr', 'value', 'special');
        });
    });

    it.only('Web integration', () => {
        cy.loginAsUser('user1.json').then(_ => {
            cy.visit('/admin/site');
            cy.title().should('equal', 'TruSpar - Site');
            cy.get('head > meta[name=description]').should('have.attr', 'content', 'Site settings');
        });
    });
});
