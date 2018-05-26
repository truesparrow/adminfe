import { JSONCookie } from 'cookie-parser'
import 'mocha'
import { MarshalFrom } from 'raynor'

import { SESSION_TOKEN_COOKIE_NAME } from '@truesparrow/identity-sdk-js/client'
import { SessionToken } from '@truesparrow/identity-sdk-js/session-token'

import { replaceSelectImage } from './commands'
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

    describe('Setup wizard', () => {
        it('Should skip to regular admin page after pressing Skip', () => {
            cy.loginAsUser('user1.json').then(([_sessionToken, _session, _userData]) => {
                cy.visit('/admin');
                cy.contains('Let\'s take a few minutes to create an event');
                cy.clickSkip();
                cy.contains('Add pictures about your event here');
            });
        });

        it('Should setup an event with some data', () => {
            cy.loginAsUser('user1.json').then(([_sessionToken, _session, _userData]) => {
                cy.visit('/admin', { onBeforeLoad: replaceSelectImage });

                cy.log('Upload image');
                cy.get('main button.sign-up').contains('Add image').click();

                cy.log('Edit the title and enable first subevent');
                cy.get('main').get('form.admin-form').first().as('form');
                cy.get('@form').get('input.admin-form-input').clear().type('Our wedding');
                cy.get('main').get('div.admin-section').first().within(() => {
                    cy.get('input[type=checkbox]').click();
                });

                cy.contains('Next').click();

                cy.log('Edit the subdomain field');
                cy.get('main').get('span.subdomain-part-input').get('input').clear().type('special');
                cy.get('main').contains('Subdomain is currently available');

                cy.contains('Done').click();

                cy.log('Check about us is correct');
                cy.get('main').find('img.thumbnail').eq(0)
                    .should('exist')
                    .and('have.attr', 'src', `${ORIGIN}/real/client/sparrow.jpg`);

                cy.log('Check event is correct');
                cy.contains('Event').click();
                cy.get('main').get('form.admin-form').first().get('input.admin-form-input')
                    .should('have.attr', 'value', 'Our wedding');

                cy.log('Check site is correct');
                cy.get('a[href="/admin/site"]').click();
                cy.get('main').get('span.subdomain-part-input').get('input').should('have.attr', 'value', 'special');
            });
        });

        it('Should allow navigation back and forth between event and site', () => {
            cy.loginAsUser('user1.json').then(([_sessionToken, _session, _userData]) => {
                cy.visit('/admin', { onBeforeLoad: replaceSelectImage });

                cy.log('Upload image');
                cy.get('main button.sign-up').contains('Add image').click();

                cy.log('Edit the title and enable first subevent');
                cy.get('main').get('form.admin-form').first().as('form');
                cy.get('@form').get('input.admin-form-input').clear().type('Our wedding');
                cy.get('main').get('div.admin-section').first().within(() => {
                    cy.get('input[type=checkbox]').click();
                });

                cy.contains('Next').click();

                cy.log('Edit the subdomain field');
                cy.get('main').get('span.subdomain-part-input').get('input').clear().type('special-x');
                cy.get('main').contains('Subdomain is currently available');

                cy.contains('Back').click();

                cy.get('main').get('form.admin-form').first().as('form');
                cy.get('@form').get('input.admin-form-input').should('have.attr', 'value', 'Our wedding');

                cy.contains('Next').click();
                cy.get('main').get('span.subdomain-part-input').get('input').should('have.attr', 'value', 'special-x');
            });
        });

        it('Skipping in the middle does not keep state', () => {
            cy.loginAsUser('user1.json').then(([_sessionToken, _session, _userData]) => {
                cy.visit('/admin', { onBeforeLoad: replaceSelectImage });

                cy.log('Upload image');
                cy.get('main button.sign-up').contains('Add image').click();

                cy.clickSkip();

                cy.log('Check about us is correct');
                cy.contains('Add image');
                cy.get('main').find('img.thumbnail').should('not.exist');

                cy.log('Check event is correct');
                cy.contains('Event').click();
                cy.get('main').get('form.admin-form').first().get('input.admin-form-input')
                    .should('have.attr', 'value', 'Default title');
            });
        });
    });
});
