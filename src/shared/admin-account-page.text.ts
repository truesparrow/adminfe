import { Message, MessageWith0Arg } from '@truesparrow/common-js'

import * as config from './config'


export const pageTitle: Message = {
    en: `${config.STYLE_APPLICATION_NAME} - Account`,
    ro: `${config.STYLE_APPLICATION_NAME} - Cont`
};

export const pageDescription: MessageWith0Arg = {
    en: 'Account administration',
    ro: 'Administrarea contului'
};

export const adminAccountPage: Message = {
    en: 'Account page',
    ro: 'Pagina de cont'
};
