import 'mocha'


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
            cy.request('/robots.txt');
        });
    });

    describe('humans.txt', () => {
        it('Should exist', () => {
            cy.request('/humans.txt');
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
