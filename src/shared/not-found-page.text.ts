import { Message, MessageWith0Arg } from '@truesparrow/common-js'

import * as config from './config'


export const pageTitle: Message = {
    en: `${config.STYLE_APPLICATION_NAME} - Page Not Found`,
    ro: `${config.STYLE_APPLICATION_NAME} - Pagina Nu Există`
};

export const pageDescription: MessageWith0Arg = {
    en: 'Page not found',
    ro: 'Pagină nu există'
};

export const notFound: Message = {
    en: 'Could not find the page',
    ro: 'Nu am putut găsii pagina'
};
