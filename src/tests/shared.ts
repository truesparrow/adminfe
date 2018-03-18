export const IDENTITY_SERVICE_HOST = Cypress.env('COMMON_IDENTITY_SERVICE_HOST');
export const CONTENT_SERVICE_HOST = Cypress.env('COMMON_CONTENT_SERVICE_HOST');
export const SITEFE_EXTERNAL_HOST = Cypress.env('COMMON_SITEFE_EXTERNAL_HOST');

export const ORIGIN_DOMAIN = Cypress.env('ADMINFE_ORIGIN_DOMAIN');
export const ORIGIN = Cypress.env('ADMINFE_ORIGIN');


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