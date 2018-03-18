import { expect } from 'chai'
import * as chai from 'chai'
import { JSONCookie } from 'cookie-parser'
import { MarshalFrom } from 'raynor'
import { raynorChai } from 'raynor-chai'
import 'mocha'

import { Env } from '@truesparrow/common-js'
import { SESSION_TOKEN_COOKIE_NAME } from '@truesparrow/identity-sdk-js/client'
import { SessionToken } from '@truesparrow/identity-sdk-js/session-token'
import '@truesparrow/filestack-picker'

import { replaceSelectImage } from './commands'


chai.use(raynorChai);

describe('adminfe', () => {
    const COMPANY_PAGES_INFO = [
        {
            title: 'About',
            path: '/company/about',
            content: 'This is the about page'
        },
        {
            title: 'Terms',
            path: '/company/tos',
            content: 'This is the terms and conditions page'
        },
        {
            title: 'Privacy',
            path: '/company/privacy',
            content: 'This is the privacy page'
        },
        {
            title: 'Cookies',
            path: '/company/cookies',
            content: 'This is the cookies page'
        }
    ];

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

    const sessionTokenMarshaller = new (MarshalFrom(SessionToken))();

    before(() => {
        cy.clearOutData();
    });

    describe('Cross-cutting concerns', () => {
        it('Should set a cookie for the session', () => {
            cy.visit('http://adminfe.local.truesparrow:10003');
            cy.getCookie(SESSION_TOKEN_COOKIE_NAME).then(cookie => {
                expect(cookie).has.property('domain').and.eql('adminfe.local.truesparrow');
                expect(cookie).has.property('path').and.eql('/');
                expect(cookie).has.property('httpOnly').and.eql(true);
                expect(cookie).has.property('secure').and.eql(false);
                expect(cookie).has.property('value');
                const sessionTokenRaw = JSONCookie(decodeURIComponent((cookie as any).value));
                expect(sessionTokenRaw).to.be.raynor(sessionTokenMarshaller);
                const sessionToken = sessionTokenMarshaller.extract(sessionTokenRaw);
                expect(sessionToken.userToken).to.be.null;
            });
        });

        it('Should maintain the session across navigation', () => {
            cy.visit('http://adminfe.local.truesparrow:10003');
            cy.getCookie(SESSION_TOKEN_COOKIE_NAME).then(cookie => {
                const sessionTokenRaw = JSONCookie(decodeURIComponent((cookie as any).value));
                const sessionToken = sessionTokenMarshaller.extract(sessionTokenRaw);

                cy.visit('http://adminfe.local.truesparrow:10003/company/tos');
                cy.getCookie(SESSION_TOKEN_COOKIE_NAME).then(cookie2 => {
                    const sessionTokenRaw2 = JSONCookie(decodeURIComponent((cookie2 as any).value));
                    const sessionToken2 = sessionTokenMarshaller.extract(sessionTokenRaw2);

                    expect(sessionToken2).to.eql(sessionToken);
                });
            });
        });

        it('Should do SSR', () => {
            // TODO: do this here.
        })
    });

    describe('Header', () => {
        describe('Anonymous user', () => {
            it('Should show logo and login button when user is not logged in', () => {
                cy.visit('http://adminfe.local.truesparrow:10003');
                cy.get('header').within(() => {
                    // Logo
                    cy.contains('TrueSparrow');
                    // Sign up button
                    cy.contains('Sign Up');
                });
            });

            it('Allows Facebook login when pressing on the sign-up button', () => {
                cy.visit('http://adminfe.local.truesparrow:10003');
                cy.get('header').get('a.sign-up').first().click();
                cy.contains('Log in with Facebook');
            });

            it('Allows Google login when pressing on the sign-up button', () => {
                cy.visit('http://adminfe.local.truesparrow:10003');
                cy.get('header').get('a.sign-up').first().click();
                cy.contains('Log in with Google');
            });
        });

        describe('Logged in user', () => {
            it('Should show logo, avatar and menu button when user is logged in', () => {
                cy.loginAsUser('user1.json').then(([_sessionToken, _session, userData]) => {
                    cy.visit('http://adminfe.local.truesparrow:10003');
                    cy.get('header').within(() => {
                        cy.contains('TrueSparrow');
                        cy.get('div.preview').should('not.exist');
                        cy.get('img.avatar').should('have.attr', 'src', userData.picture);
                        cy.get('div.logged-in-menu').should('exist');
                    });
                });
            });

            it('Should show logo, preview, avatar and menu button when user is logged in and has event', () => {
                cy.loginAsUser('user1.json').then(([sessionToken, _session, userData]) => {
                    cy.addEvent(sessionToken, 'event1.json').then(event => {
                        cy.visit('http://adminfe.local.truesparrow:10003');
                        cy.contains('TrueSparrow');
                        cy.get('div.preview').should('exist');
                        cy.get('div.preview').find('a').should('have.attr', 'href', event.homeUri(Env.Local, 'sitefe.local.truesparrow:10004'))
                        cy.get('img.avatar').should('have.attr', 'src', userData.picture);
                        cy.get('div.logged-in-menu').should('exist');
                    });
                });
            });

            describe('Hamburger menu', () => {
                it('Shows a menu when clicked', () => {
                    cy.loginAsUser('user1.json').then(_ => {
                        cy.visit('http://adminfe.local.truesparrow:10003');
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
                        cy.visit('http://adminfe.local.truesparrow:10003');
                        cy.get('header').get('button.menu-closed').click();
                        cy.get('#overlay-menu').get('button.menu-open').click();
                        cy.get('#overlay-menu').should('not.exist');
                    });
                });

                for (let { title, path, content } of ADMIN_PAGES_INFO) {
                    it(`Shows and links to admin page for ${title}`, () => {
                        cy.loginAsUser('user1.json').then(_ => {
                            cy.visit('http://adminfe.local.truesparrow:10003');
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

    describe('Footer', () => {
        it('Common footer structure', () => {
            cy.visit('http://adminfe.local.truesparrow:10003');
            cy.get('footer').within(() => {
                // Company pages links
                for (let { title } of COMPANY_PAGES_INFO) {
                    cy.contains(title);
                }
                // Copyright notice
                cy.contains('Copyright © 2018');
            });
        });

        for (let { title, path } of COMPANY_PAGES_INFO) {
            it(`Shows and links to company pages for ${title}`, () => {
                cy.visit('http://adminfe.local.truesparrow:10003');
                cy.get('footer').within(() => {
                    cy.contains(title).click();
                    cy.url().should('include', path);
                });
            });
        }
    });

    describe('Home page', () => {
        it('Common structure', () => {
            cy.visit('http://adminfe.local.truesparrow:10003/');
            cy.get('main').within(() => {
                cy.contains('Wedding Websites');
                cy.contains('Features');
                cy.contains('Pricing');
            });
        });

        describe('Anonymous user', () => {
            it('Shows a sign-up button', () => {
                cy.visit('http://adminfe.local.truesparrow:10003/');
                cy.get('main').get('a.sign-up').contains('Sign Up').first().click();
                cy.contains('Log in with Facebook');
                cy.contains('Log in with Google');
            })
        });

        describe('Logged in user', () => {
            it('Shows event button', () => {
                cy.loginAsUser('user1.json').then(_ => {
                    cy.visit('http://adminfe.local.truesparrow:10003/');
                    cy.get('main').get('a.sign-up').contains('Your Event').first().click();
                    cy.url().should('include', '/admin');
                });
            });
        });
    });

    describe('Company pages', () => {
        for (let { title, path, content } of COMPANY_PAGES_INFO) {
            it(`${title} page`, () => {
                cy.visit(`http://adminfe.local.truesparrow:10003${path}`);
                cy.contains(content);
            });
        }
    });

    describe('Admin frame', () => {
        it('Session without account cannot go to admin area', () => {
            cy.visit('http://adminfe.local.truesparrow:10003/admin');
            // The Auth0 Lock appears
            cy.contains('Should be logged in');
            cy.contains('Log in with Facebook');
            cy.contains('Log in with Google');
        });

        it('Session with account can go to the admin area', () => {
            cy.loginAsUser('user1.json').then(([_sessionToken, _session, userData]) => {
                cy.visit('http://adminfe.local.truesparrow:10003/admin');
                cy.get('img.avatar').should('have.attr', 'src', userData.picture);
            });
        });

        it('Should show the about us page when going to the admin area', () => {
            cy.loginAsUser('user1.json').then(_ => {
                cy.visit('http://adminfe.local.truesparrow:10003/admin');
                cy.contains('Add pictures about your event here');
            });
        });

        describe('Sidebar', () => {
            for (let { title, path, content } of ADMIN_PAGES_INFO) {
                it(`Shows and links to admin page for ${title}`, () => {
                    cy.loginAsUser('user1.json').then(_ => {
                        cy.visit('http://adminfe.local.truesparrow:10003/admin');
                        cy.get('div.side-menu').contains(title).click();
                        cy.url().should('include', path);
                        cy.contains(content);
                    });
                });
            }
        });

        describe('Misc flows', () => {
            it('The logout flow', () => {
                cy.loginAsUser('user1.json').then(([_sessionToken, _session, _data]) => {
                    cy.visit('http://adminfe.local.truesparrow:10003/admin');

                    cy.log('Press the logout button');
                    cy.get('header').get('button.menu-closed').click();
                    cy.get('#overlay-menu').contains('Logout').click();

                    cy.log('Check we\'re on the home page');
                    cy.url().should('eql', 'http://adminfe.local.truesparrow:10003/');
                    cy.contains('Sign Up');

                    // TODO: fix this sometime
                    // cy.log('Check there is a new cookie without a user');
                    // cy.getCookie(SESSION_TOKEN_COOKIE_NAME).then(cookie => {
                    //     const newSessionTokenRaw = JSONCookie(decodeURIComponent((cookie as any).value));
                    //     const newSessionToken = sessionTokenMarshaller.extract(newSessionTokenRaw);

                    //     expect(newSessionToken.sessionId).to.not.eql(sessionToken.sessionId);
                    //     expect(newSessionToken.userToken).to.be.null;
                    // });
                });
            });

            it('Should hide the preview button when event is not yet OK', () => {
                cy.loginAsUser('user1.json').then(([sessionToken, _session, _userData]) => {
                    cy.addEvent(sessionToken, 'event1.json').then(_event => {
                        cy.visit('http://adminfe.local.truesparrow:10003/admin');
                        cy.get('div.preview').should('exist');

                        cy.log('Remove images');
                        cy.get('main').find('img.thumbnail').eq(2).parent().find('button.remove-picture').click();
                        cy.get('main').find('img.thumbnail').eq(1).parent().find('button.remove-picture').click();
                        cy.get('main').find('img.thumbnail').eq(0).parent().find('button.remove-picture').click();

                        cy.log('Click save');
                        cy.clickSave('Add pictures about your event here.');

                        cy.log('Check preview button does not exist');
                        cy.get('div.preview').should('not.exist');
                    });
                });
            });
        });

        describe('About us page', () => {
            it('Allows uploading an image', () => {
                cy.loginAsUser('user1.json').then(_ => {
                    cy.visit('http://adminfe.local.truesparrow:10003/admin/main', { onBeforeLoad: replaceSelectImage });

                    cy.log('Upload image');
                    cy.get('main button.sign-up').contains('Add image').click();
                    cy.get('main').find('img.thumbnail').eq(0)
                        .should('exist')
                        .and('have.attr', 'src', 'http://adminfe.local.truesparrow:10003/real/client/sparrow.jpg');;

                    cy.log('Click save');
                    cy.clickSave('Add pictures about your event here.');

                    cy.log('Check that we have the right data back');
                    cy.visit('http://adminfe.local.truesparrow:10003/admin/main');
                    cy.get('main').get('div.picture-container').within(() => {
                        cy.get('img.thumbnail').should('have.attr', 'src', 'http://adminfe.local.truesparrow:10003/real/client/sparrow.jpg');
                    });
                });
            });

            it('Allows uploading three images', () => {
                cy.loginAsUser('user1.json').then(_ => {
                    cy.visit('http://adminfe.local.truesparrow:10003/admin/main', { onBeforeLoad: replaceSelectImage });

                    cy.log('Upload images');
                    cy.get('main button.sign-up').contains('Add image').click();
                    cy.get('main').find('img.thumbnail').eq(0)
                        .should('exist')
                        .and('have.attr', 'src', 'http://adminfe.local.truesparrow:10003/real/client/sparrow.jpg');
                    cy.get('main button.sign-up').contains('Add image').click();
                    cy.get('main').find('img.thumbnail').eq(1)
                        .should('exist')
                        .and('have.attr', 'src', 'http://adminfe.local.truesparrow:10003/real/client/couple.jpg');;
                    cy.get('main button.sign-up').contains('Add image').click();
                    cy.get('main').find('img.thumbnail').eq(2)
                        .should('exist')
                        .and('have.attr', 'src', 'http://adminfe.local.truesparrow:10003/real/client/ceremony.jpg');;

                    cy.log('Click save');
                    cy.clickSave('Add pictures about your event here.');

                    cy.log('Check that we have the right data back');
                    cy.visit('http://adminfe.local.truesparrow:10003/admin/main');
                    cy.get('main').find('img.thumbnail').eq(0)
                        .should('exist')
                        .and('have.attr', 'src', 'http://adminfe.local.truesparrow:10003/real/client/sparrow.jpg');
                    cy.get('main').find('img.thumbnail').eq(1)
                        .should('exist')
                        .and('have.attr', 'src', 'http://adminfe.local.truesparrow:10003/real/client/couple.jpg');;
                    cy.get('main').find('img.thumbnail').eq(2)
                        .should('exist')
                        .and('have.attr', 'src', 'http://adminfe.local.truesparrow:10003/real/client/ceremony.jpg');;
                });
            });

            it('Remove image before being saved', () => {
                cy.loginAsUser('user1.json').then(_ => {
                    cy.visit('http://adminfe.local.truesparrow:10003/admin/main', { onBeforeLoad: replaceSelectImage });

                    cy.log('Upload images');
                    cy.get('main button.sign-up').contains('Add image').click();
                    cy.get('main').find('img.thumbnail').eq(0)
                        .should('exist')
                        .and('have.attr', 'src', 'http://adminfe.local.truesparrow:10003/real/client/sparrow.jpg');
                    cy.get('main button.sign-up').contains('Add image').click();
                    cy.get('main').find('img.thumbnail').eq(1)
                        .should('exist')
                        .and('have.attr', 'src', 'http://adminfe.local.truesparrow:10003/real/client/couple.jpg');

                    cy.log('Remove first image');
                    cy.get('main').find('img.thumbnail').eq(0).parent().find('button.remove-picture').click();
                    cy.get('main').find('img.thumbnail').eq(0)
                        .should('exist')
                        .and('have.attr', 'src', 'http://adminfe.local.truesparrow:10003/real/client/couple.jpg');;
                    cy.get('main').find('img.thumbnail').eq(1).should('not.exist');

                    cy.log('Click save');
                    cy.clickSave('Add pictures about your event here.');

                    cy.log('Check that we have the right data back');
                    cy.visit('http://adminfe.local.truesparrow:10003/admin/main');
                    cy.get('main').find('img.thumbnail').eq(0)
                        .should('exist')
                        .and('have.attr', 'src', 'http://adminfe.local.truesparrow:10003/real/client/couple.jpg');;
                    cy.get('main').find('img.thumbnail').eq(1).should('not.exist');
                });
            });

            it('Remove image after being saved', () => {
                cy.loginAsUser('user1.json').then(_ => {
                    cy.visit('http://adminfe.local.truesparrow:10003/admin/main', { onBeforeLoad: replaceSelectImage });

                    cy.log('Upload images');
                    cy.get('main button.sign-up').contains('Add image').click();
                    cy.get('main').find('img.thumbnail').eq(0)
                        .should('exist')
                        .and('have.attr', 'src', 'http://adminfe.local.truesparrow:10003/real/client/sparrow.jpg');
                    cy.get('main button.sign-up').contains('Add image').click();
                    cy.get('main').find('img.thumbnail').eq(1)
                        .should('exist')
                        .and('have.attr', 'src', 'http://adminfe.local.truesparrow:10003/real/client/couple.jpg');

                    cy.log('Click save');
                    cy.clickSave('Add pictures about your event here.');

                    cy.log('Remove the first image');
                    cy.get('main').find('img.thumbnail').eq(0).parent().find('button.remove-picture').click();
                    cy.get('main').find('img.thumbnail').eq(0)
                        .should('exist')
                        .and('have.attr', 'src', 'http://adminfe.local.truesparrow:10003/real/client/couple.jpg');;
                    cy.get('main').find('img.thumbnail').eq(1).should('not.exist');

                    cy.log('Click save');
                    cy.clickSave('Add pictures about your event here.');

                    cy.log('Check that the right data is back on a new load');
                    cy.visit('http://adminfe.local.truesparrow:10003/admin/main');
                    cy.get('main').find('img.thumbnail').eq(0)
                        .should('exist')
                        .and('have.attr', 'src', 'http://adminfe.local.truesparrow:10003/real/client/couple.jpg');;
                    cy.get('main').find('img.thumbnail').eq(1).should('not.exist');
                });
            });
        });

        describe('Event page', () => {
            it('Allows changing the title', () => {
                cy.loginAsUser('user1.json').then(_ => {
                    cy.visit('http://adminfe.local.truesparrow:10003/admin/event');

                    cy.log('Edit the title');
                    cy.get('main').get('form.admin-form').first().as('form');
                    cy.get('@form').get('input.admin-form-input').clear().type('Our wedding');

                    cy.log('Click save');
                    cy.clickSave('Fill out details about your event here');

                    cy.log('Check that we have the right data back');
                    cy.visit('http://adminfe.local.truesparrow:10003/admin/event');
                    cy.get('main').get('form.admin-form').first().get('input.admin-form-input')
                        .should('have.attr', 'value', 'Our wedding');
                });
            });

            it('Allows changing the civil ceremony', () => {
                cy.loginAsUser('user1.json').then(_ => {
                    cy.visit('http://adminfe.local.truesparrow:10003/admin/event');

                    cy.log('Edit all fields of the subevent');
                    cy.get('main').get('div.admin-section').first().within(() => {
                        cy.get('input[type=checkbox]').click();
                        cy.contains('Address');
                        cy.contains('Time and date');
                        cy.get('input[type=text].address-input').clear().type('Bucharest City Hall');
                        cy.get('div.address-item.address-item-active div.suggestion').click();
                        cy.get('div.address-container').should('not.be.visible');
                        cy.get('input[type=text].admin-form-input').clear().type('10/02/2022');
                        cy.get('table td[data-value=2]').first().click();
                        cy.contains('Civil Ceremony').click();
                    });

                    cy.log('Click save and wait for save to be registered');
                    cy.clickSave('Fill out details about your event here');

                    cy.log('Check that we have the right data back');
                    cy.visit('http://adminfe.local.truesparrow:10003/admin/event');
                    cy.get('main').get('div.admin-section').first().within(() => {
                        cy.get('input[type=checkbox]').should('have.attr', 'checked', 'checked');
                        cy.get('input[type=text].address-input').should('have.attr', 'value', 'Bucharest City Hall, Bulevardul Regina Elisabeta, Bucharest, Romania');
                        cy.get('input[type=text].admin-form-input').should('have.attr', 'value', '03/01/2018 10:00 PM');
                    });
                });
            });

            it('Allows changing the religious ceremony', () => {
                cy.loginAsUser('user1.json').then(_ => {
                    cy.visit('http://adminfe.local.truesparrow:10003/admin/event');

                    cy.log('Edit all fields of the subevent');
                    cy.get('main').get('div.admin-section').next().first().within(() => {
                        cy.get('input[type=checkbox]').click();
                        cy.contains('Address');
                        cy.contains('Time and date');
                        cy.get('input[type=text].address-input').clear().type('Biserica Icoanei');
                        cy.get('div.address-item.address-item-active div.suggestion').click();
                        cy.get('div.address-container').should('not.be.visible');
                        cy.get('input[type=text].admin-form-input').clear().type('10/02/2022');
                        cy.get('table td[data-value=2]').first().click();
                        cy.contains('Religious Ceremony').click();
                    });

                    cy.log('Click save and wait for save to be registered');
                    cy.clickSave('Fill out details about your event here');

                    cy.log('Check that we have the right data back');
                    cy.visit('http://adminfe.local.truesparrow:10003/admin/event');
                    cy.get('main').get('div.admin-section').next().first().within(() => {
                        cy.get('input[type=checkbox]').should('have.attr', 'checked', 'checked');
                        cy.get('input[type=text].address-input').should('have.attr', 'value', 'Biserica Icoanei, Strada Icoanei, Bucharest, Romania');
                        cy.get('input[type=text].admin-form-input').should('have.attr', 'value', '03/01/2018 10:00 PM');
                    });
                });
            });

            it('Allows changing the reception', () => {
                cy.loginAsUser('user1.json').then(_ => {
                    cy.visit('http://adminfe.local.truesparrow:10003/admin/event');

                    cy.log('Edit all fields of the subevent');
                    cy.get('main').get('div.admin-section').next().next().first().within(() => {
                        cy.get('input[type=checkbox]').click();
                        cy.contains('Address');
                        cy.contains('Time and date');
                        cy.get('input[type=text].address-input').clear().type('Scala Events');
                        cy.get('div.address-item.address-item-active div.suggestion').click();
                        cy.get('div.address-container').should('not.be.visible');
                        cy.get('input[type=text].admin-form-input').clear().type('10/02/2022');
                        cy.get('table td[data-value=2]').first().click();
                        cy.contains('Reception').click();
                    });

                    cy.log('Click save');
                    cy.clickSave('Fill out details about your event here');

                    cy.log('Check that we have the right data back');
                    cy.visit('http://adminfe.local.truesparrow:10003/admin/event');
                    cy.get('main').get('div.admin-section').next().next().first().within(() => {
                        cy.get('input[type=checkbox]').should('have.attr', 'checked', 'checked');
                        cy.get('input[type=text].address-input').should('have.attr', 'value', 'Scala Events, Bulevardul Mircea Eliade, Bucharest, Romania');
                        cy.get('input[type=text].admin-form-input').should('have.attr', 'value', '03/01/2018 10:00 PM');
                    });
                });
            });
        });

        describe('Site page', () => {
            it('Allows changing DNS subdomain', () => {
                cy.loginAsUser('user1.json').then(_ => {
                    cy.visit('http://adminfe.local.truesparrow:10003/admin/site');

                    cy.log('Edit the subdomain field');
                    cy.get('main').get('span.subdomain-part-input').get('input').clear().type('special');
                    cy.get('main').contains('Subdomain is currently available');

                    cy.log('Click save and wait for it to be registered');
                    cy.clickSave('DNS');

                    cy.log('Check that we have the right data back');
                    cy.visit('http://adminfe.local.truesparrow:10003/admin/site');
                    cy.get('main').get('span.subdomain-part-input').get('input').should('have.attr', 'value', 'special');
                });
            });
        });
    });

    describe('Account page', () => {
        it('Should be a scaffold', () => {
            cy.loginAsUser('user1.json').then(_ => {
                cy.visit('http://adminfe.local.truesparrow:10003/admin/account');
                cy.get('main').contains('Account page');
            });
        });
    });

    describe('Large scale SEO & Web integration', () => {
        describe('favicon.ico', () => {
            it('Should be referenced by pages', () => {
                // TODO
            });

            it('Should exist', () => {
                cy.request('http://adminfe.local.truesparrow:10003/real/client/favicon.ico');
            })
        });

        describe('robots.txt', () => {
            it('Should exist', () => {
                cy.request('http://adminfe.local.truesparrow:10003/robots.txt');
            })
        });

        describe('humans.txt', () => {
            it('Should exist', () => {
                cy.request('http://adminfe.local.truesparrow:10003/humans.txt');
            })
        });

        describe('sitemap.xml', () => {
            it('Should exist', () => {
                cy.request('http://adminfe.local.truesparrow:10003/sitemap.xml');
            })
        });
    });
});
