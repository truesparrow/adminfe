import { Message, MessageWith0Arg } from '@truesparrow/common-js'

import * as config from './config'


export const pageTitle: MessageWith0Arg = {
    en: `${config.STYLE_APPLICATION_NAME} - Site`,
    ro: `${config.STYLE_APPLICATION_NAME} - Site`
};

export const pageDescription: MessageWith0Arg = {
    en: 'Site settings',
    ro: 'Setări ale site-ului'
};

export const fillOut: Message = {
    en: 'Change the details about your generated site here',
    ro: 'Schimbați detalii despre site-ul generat aici'
};
