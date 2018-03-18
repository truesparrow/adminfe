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
            for (let { title } of COMPANY_PAGES_INFO) {
                cy.contains(title);
            }
            // Copyright notice
            cy.contains('Copyright © 2018');
        });
    });

    for (let { title, path } of COMPANY_PAGES_INFO) {
        it(`Shows and links to company pages for ${title}`, () => {
            cy.visit('/');
            cy.get('footer').within(() => {
                cy.contains(title).click();
                cy.url().should('include', path);
            });
        });
    }
});
