import 'mocha'

import { COMPANY_PAGES_INFO } from './shared'


describe('Footer', () => {
    before(() => {
        cy.clearOutData();
    });

    it('Common footer structure', () => {
        cy.visit('/');
        cy.get('footer').within(() => {
            // Company pages links
            for (let { shortTitle } of COMPANY_PAGES_INFO) {
                cy.contains(shortTitle);
            }
            // Copyright notice
            cy.contains('Copyright © 2018');
        });
    });

    for (let { title, shortTitle, path } of COMPANY_PAGES_INFO) {
        it(`Shows and links to company pages for ${title}`, () => {
            cy.visit('/');
            cy.get('footer').within(() => {
                cy.contains(shortTitle).click();
                cy.url().should('include', path);
            });
        });
    }
});
