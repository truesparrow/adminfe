import 'mocha'

import { replaceSelectImage } from './commands'
import { ORIGIN } from './shared'


describe('About us page', () => {
    before(() => {
        cy.clearOutData();
    });

    it('Allows uploading an image', () => {
        cy.loginAsUser('user1.json').then(_ => {
            cy.visit('/admin/main', { onBeforeLoad: replaceSelectImage });

            cy.log('Upload image');
            cy.get('main button.sign-up').contains('Add image').click();
            cy.get('main').find('img.thumbnail').eq(0)
                .should('exist')
                .and('have.attr', 'src', `${ORIGIN}/real/client/sparrow.jpg`);

            cy.log('Check that we have the right data back');
            cy.visit('/admin/main');
            cy.get('main').get('div.picture-container').within(() => {
                cy.get('img.thumbnail').should('have.attr', 'src', `${ORIGIN}/real/client/sparrow.jpg`);
            });
        });
    });

    it('Allows uploading three images', () => {
        cy.loginAsUser('user1.json').then(_ => {
            cy.visit('/admin/main', { onBeforeLoad: replaceSelectImage });

            cy.log('Upload images');
            cy.get('main button.sign-up').contains('Add image').click();
            cy.get('main').find('img.thumbnail').eq(0)
                .should('exist')
                .and('have.attr', 'src', `${ORIGIN}/real/client/sparrow.jpg`);
            cy.get('main button.sign-up').contains('Add image').click();
            cy.get('main').find('img.thumbnail').eq(1)
                .should('exist')
                .and('have.attr', 'src', `${ORIGIN}/real/client/couple.jpg`);
            cy.get('main button.sign-up').contains('Add image').click();
            cy.get('main').find('img.thumbnail').eq(2)
                .should('exist')
                .and('have.attr', 'src', `${ORIGIN}/real/client/ceremony.jpg`);

            cy.log('Check that we have the right data back');
            cy.visit('/admin/main');
            cy.get('main').find('img.thumbnail').eq(0)
                .should('exist')
                .and('have.attr', 'src', `${ORIGIN}/real/client/sparrow.jpg`);
            cy.get('main').find('img.thumbnail').eq(1)
                .should('exist')
                .and('have.attr', 'src', `${ORIGIN}/real/client/couple.jpg`);
            cy.get('main').find('img.thumbnail').eq(2)
                .should('exist')
                .and('have.attr', 'src', `${ORIGIN}/real/client/ceremony.jpg`);
        });
    });

    it('Remove image before being saved', () => {
        cy.loginAsUser('user1.json').then(_ => {
            cy.visit('/admin/main', { onBeforeLoad: replaceSelectImage });

            cy.log('Upload images');
            cy.get('main button.sign-up').contains('Add image').click();
            cy.get('main').find('img.thumbnail').eq(0)
                .should('exist')
                .and('have.attr', 'src', `${ORIGIN}/real/client/sparrow.jpg`);
            cy.get('main button.sign-up').contains('Add image').click();
            cy.get('main').find('img.thumbnail').eq(1)
                .should('exist')
                .and('have.attr', 'src', `${ORIGIN}/real/client/couple.jpg`);

            cy.log('Remove first image');
            cy.get('main').find('img.thumbnail').eq(0).parent().find('button.remove-picture').click();
            cy.get('main').find('img.thumbnail').eq(0)
                .should('exist')
                .and('have.attr', 'src', `${ORIGIN}/real/client/couple.jpg`);
            cy.get('main').find('img.thumbnail').eq(1).should('not.exist');

            cy.log('Check that we have the right data back');
            cy.visit('/admin/main');
            cy.get('main').find('img.thumbnail').eq(0)
                .should('exist')
                .and('have.attr', 'src', `${ORIGIN}/real/client/couple.jpg`);
            cy.get('main').find('img.thumbnail').eq(1).should('not.exist');
        });
    });

    it('Remove image after being saved', () => {
        cy.loginAsUser('user1.json').then(_ => {
            cy.visit('/admin/main', { onBeforeLoad: replaceSelectImage });

            cy.log('Upload images');
            cy.get('main button.sign-up').contains('Add image').click();
            cy.get('main').find('img.thumbnail').eq(0)
                .should('exist')
                .and('have.attr', 'src', `${ORIGIN}/real/client/sparrow.jpg`);
            cy.get('main button.sign-up').contains('Add image').click();
            cy.get('main').find('img.thumbnail').eq(1)
                .should('exist')
                .and('have.attr', 'src', `${ORIGIN}/real/client/couple.jpg`);

            cy.visit('/admin/main');

            cy.log('Remove the first image');
            cy.get('main').find('img.thumbnail').eq(0).parent().find('button.remove-picture').click();
            cy.get('main').find('img.thumbnail').eq(0)
                .should('exist')
                .and('have.attr', 'src', `${ORIGIN}/real/client/couple.jpg`);
            cy.get('main').find('img.thumbnail').eq(1).should('not.exist');

            cy.log('Check that the right data is back on a new load');
            cy.visit('/admin/main');
            cy.get('main').find('img.thumbnail').eq(0)
                .should('exist')
                .and('have.attr', 'src', `${ORIGIN}/real/client/couple.jpg`);
            cy.get('main').find('img.thumbnail').eq(1).should('not.exist');
        });
    });
});
