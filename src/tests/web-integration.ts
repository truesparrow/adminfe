import { expect } from 'chai'
import * as HttpStatus from 'http-status-codes'
import 'mocha'

import {
    CONTACT_AUTHORS,
    CONTACT_EMAIL,
    FACEBOOK_APP_ID,
    ORIGIN,
    STYLE_APPLICATION_NAME,
    STYLE_PRIMARY_COLOR,
    ALL_PAGES
} from './shared'


describe('Large scale SEO & Web integration', () => {
    before(() => {
        cy.clearOutData();
    });

    describe('favicons', () => {
        for (const { path, failOnStatusCode } of ALL_PAGES) {
            it(`${path} should reference favicons`, () => {
                cy.loginAsUser('user1.json').then(_ => {
                    cy.visit(path, { failOnStatusCode: failOnStatusCode == undefined ? true : failOnStatusCode });
                    cy.get('head > link[rel=apple-touch-icon]')
                        .should('have.attr', 'sizes', '180x180')
                        .should('have.attr', 'href', '/real/client/apple-touch-icon.png');
                    cy.get('head > link[rel=icon][sizes=32x32]')
                        .should('have.attr', 'type', 'image/png')
                        .should('have.attr', 'href', '/real/client/favicon-32x32.png');
                    cy.get('head > link[rel=icon][sizes=16x16]')
                        .should('have.attr', 'type', 'image/png')
                        .should('have.attr', 'href', '/real/client/favicon-16x16.png');
                    cy.get('head > link[rel=mask-icon]')
                        .should('have.attr', 'href', '/real/client/safari-pinned-tab.svg')
                        .should('have.attr', 'color', '#5bbad5');
                    cy.get('head > link[rel=\'shortcut icon\']')
                        .should('have.attr', 'href', '/real/client/favicon.ico');
                    cy.get('head > meta[name=msapplication-TileColor]')
                        .should('have.attr', 'content', '#1498d5');
                    cy.get('head > meta[name=theme-color]')
                        .should('have.attr', 'content', '#1498d5');
                    cy.get('head > link[rel=manifest]')
                        .should('have.attr', 'href', '/site.webmanifest');
                    cy.get('head > meta[name=msapplication-config]')
                        .should('have.attr', 'content', '/browserconfig.xml');
                });
            });
        }

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
                expect(resp.body).to.contain(`<loc>${ORIGIN}/</loc>`);
                expect(resp.body).to.contain(`<loc>${ORIGIN}/company/about</loc>`);
                expect(resp.body).to.contain(`<loc>${ORIGIN}/company/tos</loc>`);
                expect(resp.body).to.contain(`<loc>${ORIGIN}/company/privacy</loc>`);
                expect(resp.body).to.contain(`<loc>${ORIGIN}/company/cookies</loc>`);
                expect(resp.body).to.contain(`<loc>${ORIGIN}/company/contact</loc>`);
            });
        });
    });

    describe('browserconfig.xml', () => {
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
            cy.request('/site.webmanifest').then(resp => {
                expect(resp.status).to.eq(HttpStatus.OK);
                expect(resp.headers['content-type']).to.eq('application/manifest+json; charset=utf-8');
                expect(resp.body).to.eql(`{
    "name": "${STYLE_APPLICATION_NAME}",
    "short_name": "${STYLE_APPLICATION_NAME}",
    "icons": [
        {
            "src": "/real/client/android-chrome-192x192.png",
            "sizes": "192x192",
            "type": "image/png"
        },
        {
            "src": "/real/client/android-chrome-512x512.png",
            "sizes": "512x512",
            "type": "image/png"
        }
    ],
    "theme_color": "${STYLE_PRIMARY_COLOR}",
    "background_color": "#ffffff",
    "start_url": "${ORIGIN}",
    "display": "standalone"
}
`);
            });
        });
    });

    describe('Page-level machine information', () => {
        for (const { path, title, description, robotsMeta, failOnStatusCode, skipCanonical } of ALL_PAGES) {
            it(`${path}`, () => {
                cy.loginAsUser('user1.json').then(_ => {
                    cy.visit(path, { failOnStatusCode: failOnStatusCode == undefined ? true : failOnStatusCode });

                    // Language
                    cy.get('html').should('have.attr', 'lang', 'en');

                    // Page specific generic web configuration
                    cy.title().should('equal', title);
                    cy.get('head > meta[name=description]').should('have.attr', 'content', description);
                    if (!skipCanonical) {
                        cy.get('head > link[rel=canonical]').should('have.attr', 'href', `${ORIGIN}${path}`);
                    }

                    // Common generic web configuration
                    cy.get('head > meta[name=keywords]').should('have.attr', 'content', 'wedding, event, website, microsite, hosted');
                    cy.get('head > meta[name=author]').should('have.attr', 'content', 'The TruSpar Team');
                    cy.get('head > link[rel=author]').should('have.attr', 'href', '/humans.txt');

                    // Robots configuration
                    cy.get('head > meta[name=robots]').should('have.attr', 'content', robotsMeta);

                    if (!skipCanonical) {
                        // Facebook OpenGraph

                        cy.get('head > meta[property=\'og:url\']').should('have.attr', 'content', `${ORIGIN}${path}`);
                        cy.get('head > meta[property=\'og:title\']').should('have.attr', 'content', title);
                        cy.get('head > meta[property=\'og:description\']').should('have.attr', 'content', description);
                        cy.get('head > meta[property=\'og:site_name\']').should('have.attr', 'content', 'TruSpar');
                        cy.get('head > meta[property=\'og:image\']').should('have.attr', 'content', `${ORIGIN}/real/client/home-page-hero.jpg`);
                        // cy.get('head > meta[property=\'og:locale\']').should('have.attr', 'content', 'en');
                        cy.get('head > meta[property=\'fb:app_id\']').should('have.attr', 'content', FACEBOOK_APP_ID);

                        // Twitter Card

                        cy.get('head > meta[name=\'twitter:card\']').should('have.attr', 'content', 'summary');
                        cy.get('head > meta[name=\'twitter:title\']').should('have.attr', 'content', title);
                        cy.get('head > meta[name=\'twitter:description\']').should('have.attr', 'content', description);
                        cy.get('head > meta[name=\'twitter:creator\']').should('have.attr', 'content', '@trusparevents');
                        cy.get('head > meta[name=\'twitter:site\']').should('have.attr', 'content', '@trusparevents');
                        cy.get('head > meta[name=\'twitter:image\']').should('have.attr', 'content', `${ORIGIN}/real/client/home-page-hero.jpg`);
                    }
                });
            });
        }
    });
});
