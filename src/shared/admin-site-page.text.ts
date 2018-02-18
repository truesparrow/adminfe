import { Message, MessageWith1Arg } from '@truesparrow/common-js'


export const fillOut: Message = {
    en: 'Change the details about your generated site here',
    ro: 'Schimbați detalii despre site-ul generat aici'
};

export const dns: Message = {
    en: 'DNS',
    ro: 'DNS'
}

export const subDomain: Message = {
    en: 'Sub Domain',
    ro: 'Subdomeniul'
};

export const siteFeDomain: MessageWith1Arg = {
    en: (host: string) => `.${host}`,
    ro: (host: string) => `.${host}`
};
