import { Message, MessageWith0Arg } from '@truesparrow/common-js'

import * as config from './config'


export const pageTitle: MessageWith0Arg = {
    en: `${config.STYLE_APPLICATION_NAME} - About Us`,
    ro: `${config.STYLE_APPLICATION_NAME} - Despre Noi`
};

export const pageDescription: MessageWith0Arg = {
    en: 'Pictures and details about you',
    ro: 'Poze și detalii despre tine'
};

export const fillOut: Message = {
    en: 'Add pictures about your event here. You can reorder them by drag-and-drop',
    ro: 'Adăugați poze despre eveniment aici. Le puteți reordona cu drag-and-drop'
};

export const addImage: Message = {
    en: 'Add image',
    ro: 'Adaugați imagine'
};

export const errorUploadingImage: Message = {
    en: 'Error uploading image',
    ro: 'Probleme la încărcarea imaginii'
};
