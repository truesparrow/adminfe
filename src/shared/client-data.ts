import {
    MarshalEnum,
    MarshalFrom,
    MarshalWith,
    OptionalOf
} from 'raynor'
import * as r from 'raynor'

import { Env, LanguageMarshaller } from '@truesparrow/common-js'
import { Event } from '@truesparrow/content-sdk-js'
import { PathMatch, Session } from '@truesparrow/identity-sdk-js'


export class ClientConfig {
    @MarshalWith(r.ArrayOf(MarshalFrom(PathMatch)))
    allowedPaths: PathMatch[];

    @MarshalWith(MarshalEnum(Env))
    env: Env;

    @MarshalWith(r.WebUriMarshaller)
    internalOrigin: string;

    @MarshalWith(r.WebUriMarshaller)
    externalOrigin: string;

    @MarshalWith(r.StringMarshaller) // TODO: should be email marshaller
    contactEmail: string;

    @MarshalWith(r.SecureWebUriMarshaller)
    demoSiteUri: string;

    @MarshalWith(r.StringMarshaller)
    styleApplicationName: string;

    // TODO: this should be an absolute path marshaller. But those don't allow "-" for some reason?
    @MarshalWith(r.StringMarshaller)
    styleLogoUri: string;

    @MarshalWith(r.StringMarshaller)
    stylePrimaryColor: string;

    @MarshalWith(r.StringMarshaller)
    siteFeExternalHost: string;

    @MarshalWith(r.StringMarshaller)
    contentServiceHost: string;

    @MarshalWith(r.PositiveIntegerMarshaller)
    contentServicePort: number;

    @MarshalWith(r.StringMarshaller)
    auth0ClientId: string;

    @MarshalWith(r.StringMarshaller)
    auth0Domain: string;

    @MarshalWith(r.UriMarshaller)
    auth0LoginCallbackUri: string;

    @MarshalWith(r.AbsolutePathMarshaller)
    logoutRoutePath: string;

    @MarshalWith(r.StringMarshaller)
    facebookAppId: string;

    @MarshalWith(r.StringMarshaller)
    googleAnalyticsAccountId: string;

    @MarshalWith(r.StringMarshaller)
    fileStackApiKey: string;

    @MarshalWith(OptionalOf(r.StringMarshaller))
    rollbarClientToken: string | null;

    @MarshalWith(LanguageMarshaller)
    language: string;

    @MarshalWith(MarshalFrom(Session))
    session: Session;
}


export class ClientInitialState {
    @MarshalWith(OptionalOf(MarshalFrom(Event)))
    event: Event | null
}
