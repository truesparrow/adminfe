import 'mocha'

import { COMPANY_PAGES_INFO } from './shared'


describe('Company pages', () => {
    before(() => {
        cy.clearOutData();
    });

    for (let { path, title, description, content } of COMPANY_PAGES_INFO) {
        it(`${title} page`, () => {
            cy.visit(path);
            cy.contains(content);
        });
    }
});
