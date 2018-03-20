import 'mocha'


describe('Event page', () => {
    before(() => {
        cy.clearOutData();
    });

    it('Allows changing the title', () => {
        cy.loginAsUser('user1.json').then(_ => {
            cy.visit('/admin/event');

            cy.log('Edit the title');
            cy.get('main').get('form.admin-form').first().as('form');
            cy.get('@form').get('input.admin-form-input').clear().type('Our wedding');

            cy.log('Click save');
            cy.clickSave('Fill out details about your event here');

            cy.log('Check that we have the right data back');
            cy.visit('/admin/event');
            cy.get('main').get('form.admin-form').first().get('input.admin-form-input')
                .should('have.attr', 'value', 'Our wedding');
        });
    });

    it('Allows changing the civil ceremony', () => {
        cy.loginAsUser('user1.json').then(_ => {
            cy.visit('/admin/event');

            cy.log('Edit all fields of the subevent');
            cy.get('main').get('div.admin-section').first().within(() => {
                cy.get('input[type=checkbox]').click();
                cy.contains('Address');
                cy.contains('Time and date');
                cy.get('input[type=text].address-input').clear().type('Bucharest City Hall');
                cy.get('div.address-item.address-item-active div.suggestion').click();
                cy.get('div.address-container').should('not.be.visible');
                cy.get('input[type=text].admin-form-input').clear().type('10/02/2022');
                cy.get('table td[data-value=2]').first().click();
                cy.contains('Civil Ceremony').click();
            });

            cy.log('Click save and wait for save to be registered');
            cy.clickSave('Fill out details about your event here');

            cy.log('Check that we have the right data back');
            cy.visit('/admin/event');
            cy.get('main').get('div.admin-section').first().within(() => {
                cy.get('input[type=checkbox]').should('have.attr', 'checked', 'checked');
                cy.get('input[type=text].address-input').should('have.attr', 'value', 'Bucharest City Hall, Bulevardul Regina Elisabeta, Bucharest, Romania');
                cy.get('input[type=text].admin-form-input').should('have.attr', 'value', '03/02/2018 12:00 AM');
            });
        });
    });

    it('Allows changing the religious ceremony', () => {
        cy.loginAsUser('user1.json').then(_ => {
            cy.visit('/admin/event');

            cy.log('Edit all fields of the subevent');
            cy.get('main').get('div.admin-section').next().first().within(() => {
                cy.get('input[type=checkbox]').click();
                cy.contains('Address');
                cy.contains('Time and date');
                cy.get('input[type=text].address-input').clear().type('Biserica Icoanei');
                cy.get('div.address-item.address-item-active div.suggestion').click();
                cy.get('div.address-container').should('not.be.visible');
                cy.get('input[type=text].admin-form-input').clear().type('10/02/2022');
                cy.get('table td[data-value=2]').first().click();
                cy.contains('Religious Ceremony').click();
            });

            cy.log('Click save and wait for save to be registered');
            cy.clickSave('Fill out details about your event here');

            cy.log('Check that we have the right data back');
            cy.visit('/admin/event');
            cy.get('main').get('div.admin-section').next().first().within(() => {
                cy.get('input[type=checkbox]').should('have.attr', 'checked', 'checked');
                cy.get('input[type=text].address-input').should('have.attr', 'value', 'Biserica Icoanei, Strada Icoanei, Bucharest, Romania');
                cy.get('input[type=text].admin-form-input').should('have.attr', 'value', '03/02/2018 12:00 AM');
            });
        });
    });

    it('Allows changing the reception', () => {
        cy.loginAsUser('user1.json').then(_ => {
            cy.visit('/admin/event');

            cy.log('Edit all fields of the subevent');
            cy.get('main').get('div.admin-section').next().next().first().within(() => {
                cy.get('input[type=checkbox]').click();
                cy.contains('Address');
                cy.contains('Time and date');
                cy.get('input[type=text].address-input').clear().type('Scala Events');
                cy.get('div.address-item.address-item-active div.suggestion').click();
                cy.get('div.address-container').should('not.be.visible');
                cy.get('input[type=text].admin-form-input').clear().type('10/02/2022');
                cy.get('table td[data-value=2]').first().click();
                cy.contains('Reception').click();
            });

            cy.log('Click save');
            cy.clickSave('Fill out details about your event here');

            cy.log('Check that we have the right data back');
            cy.visit('/admin/event');
            cy.get('main').get('div.admin-section').next().next().first().within(() => {
                cy.get('input[type=checkbox]').should('have.attr', 'checked', 'checked');
                cy.get('input[type=text].address-input').should('have.attr', 'value', 'Scala Events, Bulevardul Mircea Eliade, Bucharest, Romania');
                cy.get('input[type=text].admin-form-input').should('have.attr', 'value', '03/02/2018 12:00 AM');
            });
        });
    });
});
