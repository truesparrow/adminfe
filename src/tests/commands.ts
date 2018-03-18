import { MarshalFrom } from 'raynor'
import * as uuid from 'uuid'

import { Image, Picture } from '@truesparrow/content-sdk-js'
import { PrivateEventResponse } from '@truesparrow/content-sdk-js/dtos'
import { SESSION_TOKEN_COOKIE_NAME, SESSION_TOKEN_HEADER_NAME } from '@truesparrow/identity-sdk-js/client'
import { SessionAndTokenResponse } from '@truesparrow/identity-sdk-js/dtos'
import { SessionToken } from '@truesparrow/identity-sdk-js/session-token'
import '@truesparrow/filestack-picker'


let uniquor = 0;


function clearOutData() {
    cy.request({
        url: 'http://identity.local.truesparrow:10001/test/clear-out',
        method: 'POST',
        headers: {
            Origin: 'http://adminfe.local.truesparrow:10003'
        }
    });
    cy.request({
        url: 'http://content.local.truesparrow:10002/test/clear-out',
        method: 'POST',
        headers: {
            Origin: 'http://adminfe.local.truesparrow:10003'
        }
    });
}

function loginAsUser(userFixture: string) {
    const sessionTokenMarshaller = new (MarshalFrom(SessionToken))();
    const sessionAndTokenResponseMarsahaller = new (MarshalFrom(SessionAndTokenResponse))();

    cy.fixture(userFixture).then(userData => {
        const newUserData = Object.assign({}, userData, { sub: uuid() });
        cy.request({
            url: 'http://identity.local.truesparrow:10001/test/create-test-user',
            method: 'POST',
            headers: {
                Origin: 'http://adminfe.local.truesparrow:10003'
            },
            body: newUserData
        }).then(response => {
            const sessionAndTokenResponse = sessionAndTokenResponseMarsahaller.extract(response.body);
            cy.setCookie(
                SESSION_TOKEN_COOKIE_NAME,
                'j:' + encodeURIComponent(JSON.stringify(sessionTokenMarshaller.pack(sessionAndTokenResponse.sessionToken))), {
                    domain: 'adminfe.local.truesparrow'
                }
            ).then(_newCookie => {
                return [sessionAndTokenResponse.sessionToken, sessionAndTokenResponse.session, newUserData];
            });
        });
    });
}

function addEvent(sessionToken: SessionToken, eventFixture: string) {
    const privateEventResponseMarshaller = new (MarshalFrom(PrivateEventResponse))();

    cy.fixture(eventFixture).then(eventData => {
        const newEventData = Object.assign({}, eventData, { subDomain: eventData.subDomain + '-' + uniquor++ });
        cy.request({
            url: 'http://content.local.truesparrow:10002/test/add-event',
            method: 'POST',
            headers: {
                Origin: 'http://adminfe.local.truesparrow:10003',
                [SESSION_TOKEN_HEADER_NAME]: JSON.stringify(sessionToken)
            },
            body: newEventData
        }).then(response => {
            return privateEventResponseMarshaller.extract(response.body).event;
        });
    });
}

function clickSave(loadingDoneText: string) {
    cy.get('main').within(() => {
        cy.get('div.action-buttons').contains('Save').as('saveButton');
        cy.get('@saveButton').should('not.have.attr', 'disabled');
        cy.get('@saveButton').click();
        cy.document().contains(loadingDoneText);
    });
}

function visitSiteFe(url: string) {
    const theUrl = new URL(url);
    const subdomain = theUrl.hostname.split('.')[0];
    const rest = theUrl.hostname.split('.').splice(1).join('.');
    const restUrl = url.replace(`${subdomain}.`, '');
    cy.setCookie('truesparrow-subdomain', subdomain, { domain: rest });
    cy.visit(restUrl);
}

function requestSiteFe(url: string) {
    const theUrl = new URL(url);
    const subdomain = theUrl.hostname.split('.')[0];
    const rest = theUrl.hostname.split('.').splice(1).join('.');
    const restUrl = url.replace(`${subdomain}.`, '');
    cy.setCookie('truesparrow-subdomain', subdomain, { domain: rest });
    cy.request(restUrl);
}

export function replaceSelectImage(win: Window) {
    // Overwrite with a dumb value it otherwise cy.stub complains about it. We could just use the
    // function from above, but we get extra infrastructure out of Cypress via cy.stub.
    win.TRUESPARROW_SELECT_IMAGE = (_key: string, _position: number) => { return Promise.resolve(new Picture()); };
    cy.stub(win, 'TRUESPARROW_SELECT_IMAGE',
        (_key: string, position: number) => {
            const picture = new Picture();
            picture.position = position;
            picture.mainImage = new Image();
            picture.mainImage.width = Picture.MAIN_WIDTH;
            picture.mainImage.height = Picture.MAIN_HEIGHT;
            picture.mainImage.format = Picture.FORMAT;
            picture.thumbnailImage = new Image();
            picture.thumbnailImage.width = Picture.THUMBNAIL_WIDTH;
            picture.thumbnailImage.height = Picture.THUMBNAIL_HEIGHT;
            picture.thumbnailImage.format = Picture.FORMAT;

            switch (position) {
                case 1:
                    picture.mainImage.uri = 'http://adminfe.local.truesparrow:10003/real/client/sparrow.jpg';
                    picture.thumbnailImage.uri = 'http://adminfe.local.truesparrow:10003/real/client/sparrow.jpg';
                    break;
                case 2:
                    picture.mainImage.uri = 'http://adminfe.local.truesparrow:10003/real/client/couple.jpg';
                    picture.thumbnailImage.uri = 'http://adminfe.local.truesparrow:10003/real/client/couple.jpg';
                    break;
                case 3:
                    picture.mainImage.uri = 'http://adminfe.local.truesparrow:10003/real/client/ceremony.jpg';
                    picture.thumbnailImage.uri = 'http://adminfe.local.truesparrow:10003/real/client/ceremony.jpg';
                    break;
                default:
                    throw new Error('Should not get here');
            }

            return Promise.resolve(picture);
        });
}


Cypress.Commands.add('clearOutData', clearOutData);
Cypress.Commands.add('loginAsUser', loginAsUser);
Cypress.Commands.add('addEvent', addEvent);
Cypress.Commands.add('clickSave', clickSave);
Cypress.Commands.add('visitSiteFe', visitSiteFe);
Cypress.Commands.add('requestSiteFe', requestSiteFe);
