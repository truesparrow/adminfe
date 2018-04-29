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


export const COMPANY_PAGES_INFO = [
    {
        path: '/company/about',
        title: 'TruSpar - About The Company',
        description: 'About the company',
        content: 'This is the about page'
    },
    {
        path: '/company/tos',
        title: 'TruSpar - Terms And Conditions',
        description: 'Terms and conditions',
        content: 'This is the terms and conditions page'
    },
    {
        path: '/company/privacy',
        title: 'TruSpar - Privacy Policy',
        description: 'Privacy policy',
        content: 'This is the privacy page'
    },
    {
        path: '/company/cookies',
        title: 'TruSpar - Cookies Policy',
        description: 'Cookies policy',
        content: 'This is the cookies page'
    },
    {
        path: '/company/contact',
        title: 'TruSpar - Contact',
        description: 'Contact',
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
