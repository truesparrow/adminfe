export const IDENTITY_SERVICE_HOST = Cypress.env('IDENTITY_SERVICE_HOST');
export const IDENTITY_SERVICE_PORT = Cypress.env('IDENTITY_SERVICE_PORT');
export const CONTENT_SERVICE_HOST = Cypress.env('CONTENT_SERVICE_HOST');
export const CONTENT_SERVICE_PORT = Cypress.env('CONTENT_SERVICE_PORT');
export const SITEFE_EXTERNAL_HOST = Cypress.env('SITEFE_EXTERNAL_HOST');
export const CONTACT_AUTHORS = 'The TruSpar Team';
export const CONTACT_EMAIL = Cypress.env('CONTACT_EMAIL');
export const STYLE_APPLICATION_NAME = 'TruSpar'
export const STYLE_PRIMARY_COLOR = '#1498d5';

export const ORIGIN_DOMAIN = Cypress.env('HOST');
const port = Cypress.env('PORT');
export const ORIGIN = `http://${ORIGIN_DOMAIN}:${port}`;

export const FACEBOOK_APP_ID = String(Cypress.env('FACEBOOK_APP_ID'));


interface PageInfo {
    path: string;
    title: string;
    shortTitle: string;
    description: string;
    robotsMeta: string;
    failOnStatusCode?: boolean;
    skipCanonical?: boolean;
    content?: string;
    breadcrumbName?: string;
    shouldSkip?: string;
}


export const HOME_PAGES_INFO: PageInfo[] = [
    {
        path: '/',
        title: 'TruSpar',
        shortTitle: 'TruSpar',
        description: 'TruSpar lets you easily build a website for your wedding',
        robotsMeta: 'index,follow'
    },
    {
        path: '/inexistent-page',
        title: 'TruSpar - Page Not Found',
        shortTitle: 'Page Not Found',
        description: 'Page not found',
        robotsMeta: 'noindex,nofollow',
        failOnStatusCode: false,
        skipCanonical: true
    }
];

export const ADMIN_PAGES_INFO: PageInfo[] = [
    {
        path: '/admin/main',
        title: 'TruSpar - About Us',
        shortTitle: 'About Us',
        description: 'Pictures and details about you',
        robotsMeta: 'noindex,nofollow',
        content: 'Add pictures about your event here',
        shouldSkip: true
    }, {
        path: '/admin/event',
        title: 'TruSpar - Event',
        shortTitle: 'Event',
        description: 'Event settings',
        robotsMeta: 'noindex,nofollow',
        content: 'Fill out details about your event here',
        shouldSkip: true
    }, {
        path: '/admin/site',
        title: 'TruSpar - Site',
        shortTitle: 'Site',
        description: 'Site settings',
        robotsMeta: 'noindex,nofollow',
        content: 'Change the details about your generated site here',
        shouldSkip: true
    }, {
        path: '/admin/account',
        title: 'TruSpar - Account',
        shortTitle: 'Account',
        description: 'Account administration',
        robotsMeta: 'noindex,nofollow',
        content: 'Account page',
        shouldSkip: true
    }
];

export const COMPANY_PAGES_INFO: PageInfo[] = [
    {
        path: '/company/about',
        title: 'TruSpar - About The Company',
        shortTitle: 'About',
        description: 'About the company',
        robotsMeta: 'index,follow',
        content: 'This is the about page',
        breadcrumbName: 'About'
    },
    {
        path: '/company/tos',
        title: 'TruSpar - Terms And Conditions',
        shortTitle: 'Terms',
        description: 'Terms and conditions',
        robotsMeta: 'index,follow',
        content: 'This is the terms and conditions page',
        breadcrumbName: 'Terms And Conditions'
    },
    {
        path: '/company/privacy',
        title: 'TruSpar - Privacy Policy',
        shortTitle: 'Privacy',
        description: 'Privacy policy',
        robotsMeta: 'index,follow',
        content: 'This is the privacy page',
        breadcrumbName: 'Privacy'
    },
    {
        path: '/company/cookies',
        title: 'TruSpar - Cookies Policy',
        shortTitle: 'Cookies',
        description: 'Cookies policy',
        robotsMeta: 'index,follow',
        content: 'This is the cookies page',
        breadcrumbName: 'Cookies'
    },
    {
        path: '/company/contact',
        title: 'TruSpar - Contact',
        shortTitle: 'Contact',
        description: 'Contact',
        robotsMeta: 'index,follow',
        content: 'We\'d love to hear from you. Drop us a line at',
        breadcrumbName: 'Contact'
    }
];

export const ALL_PAGES: PageInfo[] =
    HOME_PAGES_INFO
        .concat(ADMIN_PAGES_INFO)
        .concat(COMPANY_PAGES_INFO);
