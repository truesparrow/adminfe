import 'mocha'


describe.only('Home page', () => {
    before(() => {
        cy.clearOutData();
    });

    it('Common structure', () => {
        cy.visit('/');
        cy.get('main').within(() => {
            cy.contains('Wedding Websites');
            cy.contains('Features');
            cy.contains('Pricing');
        });
    });

    describe('Anonymous user', () => {
        it('Shows a sign-up button', () => {
            cy.visit('/');
            cy.get('main').get('a.sign-up').contains('Sign Up').first().click();
            cy.contains('Log in with Facebook');
            cy.contains('Log in with Google');
        })
    });

    describe('Logged in user', () => {
        it('Shows event button', () => {
            cy.loginAsUser('user1.json').then(_ => {
                cy.visit('/');
                cy.get('main').get('a.sign-up').contains('Your Event').first().click();
                cy.url().should('include', '/admin');
            });
        });
    });

    it('Web integration', () => {
        cy.visit('/');
        cy.title().should('equal', 'TruSpar');
        cy.get('head > meta[name=description]').should('have.attr', 'content', 'TruSpar lets you easily build a website for your wedding');
    });
});
