import { Message, MessageWith0Arg, MessageWith1Arg } from '@truesparrow/common-js'
import { Event } from '@truesparrow/content-sdk-js'


export const fillOut: Message = {
    en: 'Change the details about your generated site here',
    ro: 'Schimbați detalii despre site-ul generat aici'
};

export const dns: Message = {
    en: 'DNS',
    ro: 'DNS'
}

export const subDomain: Message = {
    en: 'Subdomain',
    ro: 'Subdomeniul'
};

export const subDomainPlaceholder: MessageWith0Arg = {
    en: `Lowercase letters, numbers and dashes, at least ${Event.SUBDOMAIN_MIN_SIZE}, at most ${Event.SUBDOMAIN_MAX_SIZE}`,
    ro: `Litere din aflabetul englez, numere și line, cel puțin ${Event.SUBDOMAIN_MIN_SIZE}, cel mult ${Event.SUBDOMAIN_MAX_SIZE}`,
};

export const subDomainTooShort: Message = {
    en: `Subdomain is too short. It must have at least ${Event.SUBDOMAIN_MIN_SIZE} letters.`,
    ro: `Subdomeniul este prea scurt. Trebuie să aiba cel puțin ${Event.SUBDOMAIN_MIN_SIZE} litere.`
};

export const subDomainTooLong: Message = {
    en: `Subdomain is too long. It must have at most ${Event.SUBDOMAIN_MAX_SIZE} letters.`,
    ro: `Subdomeniul este prea lung. Trebuie să aiba cel mult ${Event.SUBDOMAIN_MAX_SIZE} litere.`
};

export const subDomainInvalidCharacters: Message = {
    en: 'Subdomain contains invalid characters. Only lowercase english letters, numbers and a dash are allowed.',
    ro: 'Subdomeniul conține caractere nepermise. Numai litere din alfabetul englez, numere si linia sunt permise.'
};

export const subDomainAvailable: Message = {
    en: 'Subdomain is currently available',
    ro: 'Subdomeniul este liber'
};

export const subDomainNotAvailable: Message = {
    en: 'Subdomain is already in use',
    ro: 'Subdomeniul este deja folosit'
};

export const siteFeDomain: MessageWith1Arg = {
    en: (host: string) => `.${host}`,
    ro: (host: string) => `.${host}`
};
