import * as React from 'react'

import * as config from './config'

import * as text from './admin.text'


export const AdminPage = () => <div>{text.adminPage[config.LANG()]}</div>;
