import * as React from 'react'

import * as config from './config'

import * as text from './admin-account-page.text'


export const AdminAccountPage = () => <div>{text.adminAccountPage[config.LANG()]}</div>;
