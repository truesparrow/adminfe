import * as React from 'react'

import * as config from './config'

import * as text from './admin-event-page.text'


export const AdminEventPage = () => <div>{text.adminEventPage[config.LANG()]}</div>;
