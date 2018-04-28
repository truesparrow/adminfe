import { expect } from 'chai'
import * as HttpStatus from 'http-status-codes'
import 'mocha'

import { CONTACT_AUTHORS, CONTACT_EMAIL, ORIGIN, STYLE_PRIMARY_COLOR } from './shared'


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

    describe('humans.txt', () => {
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
            cy.request('/sitemap.xml').then(resp => {
                expect(resp.status).to.eq(HttpStatus.OK);
                expect(resp.headers['content-type']).to.eq('application/xml; charset=utf-8');
                expect(resp.body).to.contain(`<?xml version="1.0" encoding="utf-8"?>
<urlset
    xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
`);
                expect(resp.body).to.contain(`<loc>${ORIGIN}</loc>`);
                expect(resp.body).to.contain(`<loc>${ORIGIN}/company/about</loc>`);
                expect(resp.body).to.contain(`<loc>${ORIGIN}/company/tos</loc>`);
                expect(resp.body).to.contain(`<loc>${ORIGIN}/company/privacy</loc>`);
                expect(resp.body).to.contain(`<loc>${ORIGIN}/company/cookies</loc>`);
                expect(resp.body).to.contain(`<loc>${ORIGIN}/company/contact</loc>`);
            });
        });
    });

    describe.only('browserconfig.xml', () => {
        it('Should exist', () => {
            cy.request('/browserconfig.xml').then(resp => {
                expect(resp.status).to.eq(HttpStatus.OK);
                expect(resp.headers['content-type']).to.eq('application/xml; charset=utf-8');
                expect(resp.body).to.contain(`<?xml version="1.0" encoding="utf-8"?>
<browserconfig>
    <msapplication>
        <tile>
            <square150x150logo src="/real/client/mstile-150x150.png"/>
            <square310x310logo src="/real/client/mstile-310x310.png"/>
            <TileColor>${STYLE_PRIMARY_COLOR}</TileColor>
        </tile>
    </msapplication>
</browserconfig>
`);
            });
        });
    });

    describe('site.webmanifest', () => {
        it('Should exist', () => {
            cy.request('/site.webmanifest');
        });
    });
});
