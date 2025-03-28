/*
* An array of routes that are accessible to the public
* These routes do not require authentication
* @type {string[]}
* */
export const publicRoutes = [
    '/',
];
/*
* An array of routes that are used for authentication
* These routes will redirect logged  users to /account
* @type {string[]}
* */
export const authRoutes = [
    '/login',
    '/register'
];

/**
 * An array of routes that are used for admins needs
 * * These routes will redirect logged  users to /admin
 * * @type {string[]}
 **/
export const protectedRoutes = [
    '/admin'
];
/*
* The prefix to authentication routes
* Routes that start with this prefix are used for API
* authentication purposes
* @type {string}
* */
export const apiAuthPrefix = '/api/auth';

export const apiServerRoutes = {
    dialogs: 'api/v1/dialogs/',
    messages: 'api/v1/messages/',
    adverts: 'api/v1/adverts/',
    responses: 'api/v1/responses/',
    users: 'api/v1/users/',
    cities: 'api/v1/cities/',
    roles: 'api/v1/roles/',
    dimensions: 'api/v1/dimensions/',
    wastes: 'api/v1/wastes/',
    wasteTypes: 'api/v1/wastes/types/',
}
/*
* The default redirect path after logged in
* @type {string}
* */
export const DEFAULT_LOGIN_REDIRECT = '/account';

