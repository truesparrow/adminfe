import { JSONCookie } from 'cookie-parser'
import 'mocha'
import { MarshalFrom } from 'raynor'

import { SESSION_TOKEN_COOKIE_NAME } from '@truesparrow/identity-sdk-js/client'
import { SessionToken } from '@truesparrow/identity-sdk-js/session-token'

import { ADMIN_PAGES_INFO, ORIGIN } from './shared'


describe('Admin frame', () => {
    before(() => {
        cy.clearOutData();
    });

    it('Session without account cannot go to admin area', () => {
        cy.visit('/admin');
        // The Auth0 Lock appears
        cy.contains('Should be logged in');
        cy.contains('Log in with Facebook');
        cy.contains('Log in with Google');
    });

    it('Session with account can go to the admin area', () => {
        cy.loginAsUser('user1.json').then(([_sessionToken, _session, userData]) => {
            cy.visit('/admin');
            cy.get('img.avatar').should('have.attr', 'src', userData.picture);
        });
    });

    it('Should show the about us page when going to the admin area', () => {
        cy.loginAsUser('user1.json').then(_ => {
            cy.visit('/admin');
            cy.clickSkip();
            cy.contains('Add pictures about your event here');
        });
    });

    describe('Sidebar', () => {
        for (let { title, shortTitle, path, content } of ADMIN_PAGES_INFO) {
            it(`Shows and links to admin page for ${title}`, () => {
                cy.loginAsUser('user1.json').then(_ => {
                    cy.visit('/admin');
                    cy.clickSkip();
                    cy.get('div.side-menu').contains(shortTitle).click();
                    cy.url().should('include', path);
                    cy.contains(content as string);
                });
            });
        }
    });

    describe('Misc flows', () => {
        const sessionTokenMarshaller = new (MarshalFrom(SessionToken))();

        it.skip('The logout flow', () => {
            cy.loginAsUser('user1.json').then(([sessionToken, _session, _data]) => {
                cy.visit('/admin');
                cy.clickSkip();

                cy.log('Press the logout button');
                cy.get('header').get('button.menu-closed').click();
                cy.get('#overlay-menu').contains('Logout').click();

                cy.log('Check we\'re on the home page');
                cy.url().should('eql', `${ORIGIN}/`);
                cy.contains('Sign Up');

                cy.log('Check there is a new cookie without a user');
                cy.getCookie(SESSION_TOKEN_COOKIE_NAME).then(cookie => {
                    const newSessionTokenRaw = JSONCookie(decodeURIComponent((cookie as any).value));
                    const newSessionToken = sessionTokenMarshaller.extract(newSessionTokenRaw);

                    expect(newSessionToken.sessionId).to.not.eql(sessionToken.sessionId);
                    expect(newSessionToken.userToken).to.be.null;
                });
            });
        });

        it('Should hide the preview button when event is not yet OK', () => {
            cy.loginAsUser('user1.json').then(([sessionToken, _session, _userData]) => {
                cy.addEvent(sessionToken, 'event1.json').then(_event => {
                    cy.visit('/admin');
                    cy.get('div.preview').should('exist');

                    cy.log('Remove images');
                    cy.get('main').find('img.thumbnail').eq(2).parent().find('button.remove-picture').click();
                    cy.get('main').find('img.thumbnail').eq(1).parent().find('button.remove-picture').click();
                    cy.get('main').find('img.thumbnail').eq(0).parent().find('button.remove-picture').click();

                    cy.log('Check preview button does not exist');
                    cy.get('div.preview').should('not.exist');
                });
            });
        });
    });
});
