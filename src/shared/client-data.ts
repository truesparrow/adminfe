import {
    MarshalEnum,
    MarshalFrom,
    MarshalWith,
    OptionalOf
} from 'raynor'
import * as r from 'raynor'

import { Env, LanguageMarshaller } from '@truesparrow/common-js'
//import { Event } from '@truesparrow/content-sdk-js'
import { PathMatch, Session } from '@truesparrow/identity-sdk-js'


export class ClientConfig {
    @MarshalWith(r.ArrayOf(MarshalFrom(PathMatch)))
    allowedPaths: PathMatch[];

    @MarshalWith(MarshalEnum(Env))
    env: Env;

    @MarshalWith(r.WebUriMarshaller)
    origin: string;

    @MarshalWith(r.StringMarshaller)
    contentServiceHost: string;

    @MarshalWith(r.StringMarshaller)
    auth0ClientId: string;

    @MarshalWith(r.StringMarshaller)
    auth0Domain: string;

    @MarshalWith(r.UriMarshaller)
    auth0LoginCallbackUri: string;

    @MarshalWith(r.AbsolutePathMarshaller)
    logoutRoutePath: string;

    @MarshalWith(OptionalOf(r.StringMarshaller))
    rollbarClientToken: string | null;

    @MarshalWith(LanguageMarshaller)
    language: string;

    @MarshalWith(MarshalFrom(Session))
    session: Session;
}


export class ClientInitialState {
    // @MarshalWith(OptionalOf(MarshalFrom(Event)))
    // event: Event | null
}
