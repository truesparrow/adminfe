export const IDENTITY_SERVICE_HOST = Cypress.env('IDENTITY_SERVICE_HOST');
export const IDENTITY_SERVICE_PORT = Cypress.env('IDENTITY_SERVICE_PORT');
export const CONTENT_SERVICE_HOST = Cypress.env('CONTENT_SERVICE_HOST');
export const CONTENT_SERVICE_PORT = Cypress.env('CONTENT_SERVICE_PORT');
export const SITEFE_EXTERNAL_HOST = Cypress.env('SITEFE_EXTERNAL_HOST');
export const CONTACT_AUTHORS = 'The TruSpar Team';
export const CONTACT_EMAIL = Cypress.env('CONTACT_EMAIL');

export const ORIGIN_DOMAIN = Cypress.env('HOST');
const port = Cypress.env('PORT');
export const ORIGIN = `http://${ORIGIN_DOMAIN}:${port}`;


export const COMPANY_PAGES_INFO = [
    {
        title: 'About',
        path: '/company/about',
        content: 'This is the about page'
    },
    {
        title: 'Terms',
        path: '/company/tos',
        content: 'This is the terms and conditions page'
    },
    {
        title: 'Privacy',
        path: '/company/privacy',
        content: 'This is the privacy page'
    },
    {
        title: 'Cookies',
        path: '/company/cookies',
        content: 'This is the cookies page'
    },
    {
        title: 'Contact',
        path: '/company/contact',
        content: 'We\'d love to hear from you. Drop us a line at'
    }
];


export const ADMIN_PAGES_INFO = [
    {
        title: 'About Us',
        path: '/admin/main',
        content: 'Add pictures about your event here'
    }, {
        title: 'Event',
        path: '/admin/event',
        content: 'Fill out details about your event here'
    }, {
        title: 'Site',
        path: '/admin/site',
        content: 'Change the details about your generated site here'
    }, {
        title: 'Account',
        path: '/admin/account',
        content: 'Account page'
    }
];
