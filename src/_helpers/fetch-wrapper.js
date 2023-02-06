import { store, authActions } from '../_store';

export const fetchWrapper = {
    get: request('GET'),
    post: request('POST'),
    put: request('PUT'),
    delete: request('DELETE')
};

function request(method) {
    return (url, body) => {
        const requestOptions = {
            method,
            headers: authHeader(url)
        };
        if (body) {
            requestOptions.headers['Content-Type'] = 'application/json';
            requestOptions.body = JSON.stringify(body);
        }
        return fetch(url, requestOptions).then(handleResponse);
    }
}

// helper functions

function authHeader(url) {
    // return auth header with jwt if user is logged in and request is to the api url
    const token = authToken();
    return (!!token && url.startsWith('http://localhost:8000'))
        ? { Authorization: `Bearer ${token}`} : {};
}

function authToken() {
    return store.getState().auth?.token;
}

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (403 === response.status && authToken()) {
                const logout = () => store.dispatch(authActions.logout());
                logout();
            }

            const error = {
                message: (data && data.message) || response.statusText,
                code: response.status
            }
            return Promise.reject(error);
        }

        return data;
    });
}