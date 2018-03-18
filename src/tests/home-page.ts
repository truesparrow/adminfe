import 'mocha'


describe('Home page', () => {
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
});
