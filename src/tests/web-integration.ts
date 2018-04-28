import { expect } from 'chai'
import * as HttpStatus from 'http-status-codes'
import 'mocha'

import { CONTACT_AUTHORS, CONTACT_EMAIL, ORIGIN } from './shared'


describe('Large scale SEO & Web integration', () => {
    before(() => {
        cy.clearOutData();
    });

    describe('favicons', () => {
        it('Should be referenced by pages', () => {
            // TODO
        });

        it('Should exist', () => {
            cy.request('/real/client/android-chrome-192x192.png');
            cy.request('/real/client/android-chrome-512x512.png');
            cy.request('/real/client/apple-touch-icon.png');
            cy.request('/real/client/mstile-150x150.png');
            cy.request('/real/client/mstile-310x310.png');
            cy.request('/real/client/favicon-32x32.png');
            cy.request('/real/client/favicon-16x16.png');
            cy.request('/real/client/safari-pinned-tab.svg');
            cy.request('/real/client/favicon.ico');
        });
    });

    describe('robots.txt', () => {
        it('Should exist', () => {
            cy.request('/robots.txt').then(resp => {
                expect(resp.status).to.eq(HttpStatus.OK);
                expect(resp.headers['content-type']).to.eq('text/plain; charset=utf-8');
                expect(resp.body).to.eql(`Sitemap: ${ORIGIN}/sitemap.xml
User-agent: *
Disallow: /admin
`);
            });
        });
    });

    describe.only('humans.txt', () => {
        it('Should exist', () => {
            cy.request('/humans.txt').then(resp => {
                expect(resp.status).to.eq(HttpStatus.OK);
                expect(resp.headers['content-type']).to.eq('text/plain; charset=utf-8');
                expect(resp.body).to.eql(`/* Team */
Programmer: ${CONTACT_AUTHORS}
Contact: ${CONTACT_EMAIL}
`);
            });
        });
    });

    describe('sitemap.xml', () => {
        it('Should exist', () => {
            cy.request('/sitemap.xml');
        });
    });

    describe('browserconfig.xml', () => {
        it('Should exist', () => {
            cy.request('/browserconfig.xml');
        });
    });

    describe('site.webmanifest', () => {
        it('Should exist', () => {
            cy.request('/site.webmanifest');
        });
    });
});
