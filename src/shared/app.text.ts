import { Message, MessageWith1Arg } from '@truesparrow/common-js'


export const pageTitle: Message = {
    en: "Truesparrow",
    ro: "Truesparrow"
};

export const home: Message = {
    en: "Home",
    ro: "Acasă"
};

export const admin: Message = {
    en: "Admin",
    ro: "Administrare"
};

export const thisIsBlog: MessageWith1Arg = {
    en: (foo: string) => `This is blog ${foo}`,
    ro: (foo: string) => `Acesta este blog ${foo}`
};
