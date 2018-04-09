import 'mocha'

import { Env } from '@truesparrow/common-js'

import { SITEFE_EXTERNAL_HOST } from './shared'


describe('Header', () => {
    const ADMIN_PAGES_INFO = [
        {
            title: 'About Us',
            path: '/admin/main',
            content: 'Add pictures about your event here'
        }, {
            title: 'Event',
            path: '/admin/event',
            content: 'Fill out details about your event here'
        }, {
            title: 'Site',
            path: '/admin/site',
            content: 'Change the details about your generated site here'
        }, {
            title: 'Account',
            path: '/admin/account',
            content: 'Account page'
        }
    ];

    before(() => {
        cy.clearOutData();
    });

    describe('Anonymous user', () => {
        it('Should show logo and login button when user is not logged in', () => {
            cy.visit('/');
            cy.get('header').within(() => {
                // Logo
                cy.get('img')
                    .should('have.attr', 'src', '/real/client/logo-big.jpg')
                    .should('have.attr', 'alt', 'TruSpar');
                // Sign up button
                cy.contains('Sign Up');
            });
        });

        it('Allows Facebook login when pressing on the sign-up button', () => {
            cy.visit('/');
            cy.get('header').get('a.sign-up').first().click();
            cy.contains('Log in with Facebook');
        });

        it('Allows Google login when pressing on the sign-up button', () => {
            cy.visit('/');
            cy.get('header').get('a.sign-up').first().click();
            cy.contains('Log in with Google');
        });
    });

    describe('Logged in user', () => {
        it('Should show logo, avatar and menu button when user is logged in', () => {
            cy.loginAsUser('user1.json').then(([_sessionToken, _session, userData]) => {
                cy.visit('/');
                cy.get('header').within(() => {
                    // Logo
                    cy.get('img').first()
                        .should('have.attr', 'src', '/real/client/logo-big.jpg')
                        .should('have.attr', 'alt', 'TruSpar');
                    cy.get('div.preview').should('not.exist');
                    cy.get('img.avatar').should('have.attr', 'src', userData.picture);
                    cy.get('div.logged-in-menu').should('exist');
                });
            });
        });

        it('Should show logo, preview, avatar and menu button when user is logged in and has event', () => {
            cy.loginAsUser('user1.json').then(([sessionToken, _session, userData]) => {
                cy.addEvent(sessionToken, 'event1.json').then(event => {
                    cy.visit('/');
                    cy.contains('TruSpar');
                    cy.get('div.preview').should('exist');
                    cy.get('div.preview').find('a').should('have.attr', 'href', event.homeUri(Env.Local, SITEFE_EXTERNAL_HOST))
                    cy.get('img.avatar').should('have.attr', 'src', userData.picture);
                    cy.get('div.logged-in-menu').should('exist');
                });
            });
        });

        describe('Hamburger menu', () => {
            it('Shows a menu when clicked', () => {
                cy.loginAsUser('user1.json').then(_ => {
                    cy.visit('/');
                    cy.get('header').get('button.menu-closed').click();
                    cy.get('#overlay-menu').within(() => {
                        cy.contains('About Us');
                        cy.contains('Event');
                        cy.contains('Site');
                        cy.contains('Account');
                        cy.contains('Logout');
                    });
                });
            });

            it('Closes the menu when open and closed', () => {
                cy.loginAsUser('user1.json').then(_ => {
                    cy.visit('/');
                    cy.get('header').get('button.menu-closed').click();
                    cy.get('#overlay-menu').get('button.menu-open').click();
                    cy.get('#overlay-menu').should('not.exist');
                });
            });

            for (let { title, path, content } of ADMIN_PAGES_INFO) {
                it(`Shows and links to admin page for ${title}`, () => {
                    cy.loginAsUser('user1.json').then(_ => {
                        cy.visit('/');
                        cy.get('header').get('button.menu-closed').click();
                        cy.get('#overlay-menu').contains(title).click();
                        cy.url().should('include', path);
                        cy.contains(content);
                    });
                });
            }
        });
    });
});
