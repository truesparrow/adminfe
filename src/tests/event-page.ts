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
                cy.wait(2000); // Wait for maps selector to pass
                cy.get('input[type=text].address-input').parent().parent().contains('Address').click();
                cy.get('div.address-container').should('not.be.visible');
                cy.get('input[type=text].admin-form-input').clear().type('10/02/2022 10:14 A');
                cy.contains('Civil Ceremony').click();
            });

            cy.log('Click save and wait for save to be registered');
            cy.clickSave('Fill out details about your event here');

            cy.log('Check that we have the right data back');
            cy.visit('/admin/event');
            cy.get('main').get('div.admin-section').first().within(() => {
                cy.get('input[type=checkbox]').should('have.attr', 'checked', 'checked');
                cy.get('input[type=text].address-input').should('have.attr', 'value', 'Bucharest City Hall');
                cy.get('input[type=text].admin-form-input').should('have.attr', 'value', '10/02/2022 10:14 AM');
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
                cy.wait(2000); // Wait for maps selector to pass
                cy.get('input[type=text].address-input').parent().parent().contains('Address').click();
                cy.get('div.address-container').should('not.be.visible');
                cy.get('input[type=text].admin-form-input').clear().type('10/02/2022 10:14 A');
                cy.contains('Religious Ceremony').click();
            });

            cy.log('Click save and wait for save to be registered');
            cy.clickSave('Fill out details about your event here');

            cy.log('Check that we have the right data back');
            cy.visit('/admin/event');
            cy.get('main').get('div.admin-section').next().first().within(() => {
                cy.get('input[type=checkbox]').should('have.attr', 'checked', 'checked');
                cy.get('input[type=text].address-input').should('have.attr', 'value', 'Biserica Icoanei');
                cy.get('input[type=text].admin-form-input').should('have.attr', 'value', '10/02/2022 10:14 AM');
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
                cy.wait(2000); // Wait for maps selector to pass
                cy.get('input[type=text].address-input').parent().parent().contains('Address').click();
                cy.get('div.address-container').should('not.be.visible');
                cy.get('input[type=text].admin-form-input').clear().type('10/02/2022 10:14 A');
                cy.contains('Reception').click();
            });

            cy.log('Click save');
            cy.clickSave('Fill out details about your event here');

            cy.log('Check that we have the right data back');
            cy.visit('/admin/event');
            cy.get('main').get('div.admin-section').next().next().first().within(() => {
                cy.get('input[type=checkbox]').should('have.attr', 'checked', 'checked');
                cy.get('input[type=text].address-input').should('have.attr', 'value', 'Scala Events');
                cy.get('input[type=text].admin-form-input').should('have.attr', 'value', '10/02/2022 10:14 AM');
            });
        });
    });

    it.only('Web integration', () => {
        cy.loginAsUser('user1.json').then(_ => {
            cy.visit('/admin/event');
            cy.title().should('equal', 'TruSpar - Event');
            cy.get('head > meta[name=description]').should('have.attr', 'content', 'Event settings');
        });
    });
});
