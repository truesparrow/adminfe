import { Message, MessageWith0Arg } from '@truesparrow/common-js'

import * as config from './config'


export const pageTitle: MessageWith0Arg = {
    en: `${config.STYLE_APPLICATION_NAME} - Event`,
    ro: `${config.STYLE_APPLICATION_NAME} - Eveniment`
};

export const pageDescription: MessageWith0Arg = {
    en: 'Event settings',
    ro: 'Setări ale evenimentului'
};

export const fillOut: Message = {
    en: 'Fill out details about your event here',
    ro: 'Completați detaliile evenimentului aici'
};
