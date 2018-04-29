import 'mocha'

import { COMPANY_PAGES_INFO } from './shared'


describe.only('Company pages', () => {
    before(() => {
        cy.clearOutData();
    });

    for (let { path, title, description, content } of COMPANY_PAGES_INFO) {
        it(`${title} page`, () => {
            cy.visit(path);
            cy.contains(content);
        });

        it(`${title} web integration`, () => {
            cy.visit(path);
            cy.title().should('equal', title);
            cy.get('head > meta[name=description]').should('have.attr', 'content', description);
        });
    }
});
