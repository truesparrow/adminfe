import { Message, MessageWith0Arg } from '@truesparrow/common-js'

import * as config from './config'


export const pageTitle: MessageWith0Arg = {
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

export const fillOut: Message = {
    en: 'Change the details about your account here',
    ro: 'Schimbați detalii despre contul dumneavoastra aici'
};

export const closeAccount: Message = {
    en: 'Close account',
    ro: 'Închideți contul'
};

export const closingAccount: MessageWith0Arg = {
    en: 'Closing account',
    ro: 'Închidem contul'
};

export const reallyCloseAccount: MessageWith0Arg = {
    en: 'Are you sure? This operation cannot be undone',
    ro: 'Sunteți sigur? Această operați nu poate fi întoară'
};
