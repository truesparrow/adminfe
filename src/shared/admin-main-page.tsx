import * as React from 'react'

import * as config from './config'

import * as text from './admin-main-page.text'


export const AdminMainPage = () => <div>{text.adminMainPage[config.LANG()]}</div>;
