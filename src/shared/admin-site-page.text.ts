import { Message, MessageWith0Arg, MessageWith1Arg } from '@truesparrow/common-js'
import { SubDomainMarshaller } from '@truesparrow/content-sdk-js'

import * as config from './config'


export const pageTitle: Message = {
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

export const dns: Message = {
    en: 'DNS',
    ro: 'DNS'
}

export const subDomain: Message = {
    en: 'Subdomain',
    ro: 'Subdomeniul'
};

export const subDomainPlaceholder: MessageWith0Arg = {
    en: `Lowercase letters, numbers and dashes, at least ${SubDomainMarshaller.SUBDOMAIN_MIN_SIZE}, at most ${SubDomainMarshaller.SUBDOMAIN_MAX_SIZE}`,
    ro: `Litere din aflabetul englez, numere și line, cel puțin ${SubDomainMarshaller.SUBDOMAIN_MIN_SIZE}, cel mult ${SubDomainMarshaller.SUBDOMAIN_MAX_SIZE}`,
};

export const subDomainTooShort: Message = {
    en: `Subdomain is too short. It must have at least ${SubDomainMarshaller.SUBDOMAIN_MIN_SIZE} letters.`,
    ro: `Subdomeniul este prea scurt. Trebuie să aiba cel puțin ${SubDomainMarshaller.SUBDOMAIN_MIN_SIZE} litere.`
};

export const subDomainTooLong: Message = {
    en: `Subdomain is too long. It must have at most ${SubDomainMarshaller.SUBDOMAIN_MAX_SIZE} letters.`,
    ro: `Subdomeniul este prea lung. Trebuie să aiba cel mult ${SubDomainMarshaller.SUBDOMAIN_MAX_SIZE} litere.`
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

export const subDomainChecking: Message = {
    en: 'Checking ...',
    ro: 'Verificăm ...'
};

export const siteFeDomain: MessageWith1Arg = {
    en: (host: string) => `.${host}`,
    ro: (host: string) => `.${host}`
};
