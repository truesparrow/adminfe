import { Message, MessageWith0Arg } from '@truesparrow/common-js'
import { TitleMarshaller } from '@truesparrow/content-sdk-js'


export const fillOut: Message = {
    en: 'Fill out details about your event here',
    ro: 'Completați detaliile evenimentului aici'
};

export const subEvents: Message = {
    en: 'Subevents',
    ro: 'Subevenimente'
};

export const eventTitle: Message = {
    en: 'Event name',
    ro: 'Numele evenimentului'
};

export const titlePlaceholder: MessageWith0Arg = {
    en: 'A name for the event',
    ro: 'Un nume pentru eveniment'
};

export const titleTooShort: Message = {
    en: `Title is too short. It must have at least ${TitleMarshaller.TITLE_MIN_SIZE} letters.`,
    ro: `Titlul este prea scurt. Trebuie sa aiba cel puțin ${TitleMarshaller.TITLE_MIN_SIZE} litere.`
};

export const titleTooLong: Message = {
    en: `Title is too long. It must have at least ${TitleMarshaller.TITLE_MAX_SIZE} letters.`,
    ro: `Titlul este prea lung. Trebuie sa aiba cel mult ${TitleMarshaller.TITLE_MAX_SIZE} litere.`
};
