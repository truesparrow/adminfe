import 'mocha'


describe('Large scale SEO & Web integration', () => {
    before(() => {
        cy.clearOutData();
    });

    describe('favicon.ico', () => {
        it('Should be referenced by pages', () => {
            // TODO
        });

        it('Should exist', () => {
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
});
