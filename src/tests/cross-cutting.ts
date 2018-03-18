import { expect } from 'chai'
import * as chai from 'chai'
import { JSONCookie } from 'cookie-parser'
import { MarshalFrom } from 'raynor'
import { raynorChai } from 'raynor-chai'
import 'mocha'

import { SESSION_TOKEN_COOKIE_NAME } from '@truesparrow/identity-sdk-js/client'
import { SessionToken } from '@truesparrow/identity-sdk-js/session-token'
import '@truesparrow/filestack-picker'


chai.use(raynorChai);

describe('Cross-cutting concerns', () => {
    const sessionTokenMarshaller = new (MarshalFrom(SessionToken))();

    before(() => {
        cy.clearOutData();
    });

    it('Should set a cookie for the session', () => {
        cy.visit('/');
        cy.getCookie(SESSION_TOKEN_COOKIE_NAME).then(cookie => {
            expect(cookie).has.property('domain').and.eql('adminfe.local.truesparrow');
            expect(cookie).has.property('path').and.eql('/');
            expect(cookie).has.property('httpOnly').and.eql(true);
            expect(cookie).has.property('secure').and.eql(false);
            expect(cookie).has.property('value');
            const sessionTokenRaw = JSONCookie(decodeURIComponent((cookie as any).value));
            expect(sessionTokenRaw).to.be.raynor(sessionTokenMarshaller);
            const sessionToken = sessionTokenMarshaller.extract(sessionTokenRaw);
            expect(sessionToken.userToken).to.be.null;
        });
    });

    it('Should maintain the session across navigation', () => {
        cy.visit('/');
        cy.getCookie(SESSION_TOKEN_COOKIE_NAME).then(cookie => {
            const sessionTokenRaw = JSONCookie(decodeURIComponent((cookie as any).value));
            const sessionToken = sessionTokenMarshaller.extract(sessionTokenRaw);

            cy.visit('/company/tos');
            cy.getCookie(SESSION_TOKEN_COOKIE_NAME).then(cookie2 => {
                const sessionTokenRaw2 = JSONCookie(decodeURIComponent((cookie2 as any).value));
                const sessionToken2 = sessionTokenMarshaller.extract(sessionTokenRaw2);

                expect(sessionToken2).to.eql(sessionToken);
            });
        });
    });

    it('Should do SSR', () => {
        // TODO: do this here.
    })
});
