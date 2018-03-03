import { Message } from '@truesparrow/common-js'
import { AddressMarshaller } from '@truesparrow/content-sdk-js'


export const haveEvent: Message = {
    en: 'Have this event',
    ro: 'Folosește evenimentul'
};

export const address: Message = {
    en: 'Address',
    ro: 'Adresă'
};

export const addressTooShort: Message = {
    en: `Address it too short. It must have at least ${AddressMarshaller.ADDRESS_MIN_SIZE} letters.`,
    ro: `Adresa este prea scurtă. Trebuie să aibă cel puțin ${AddressMarshaller.ADDRESS_MIN_SIZE} litere.`
};

export const timeAndDate: Message = {
    en: 'Time and date',
    ro: 'Ora si data'
};

export const dateAndTimeInvalid: Message = {
    en: 'Date and time are in an invalid format',
    ro: 'Data și ora sunt într-un format incorect'
};
