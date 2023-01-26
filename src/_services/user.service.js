export const userService = {
    login,
    logout,
    register,
}

function login(nickname, password) {
    return fetch('http://localhost:8000/api/v1/auth/login/system', {
        method: "POST",
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ nickname, password})
    })
        .then(handleResponse)
        .then(token => {
            localStorage.setItem('token', JSON.stringify(token))
            return token;
        });
}

function register(user) {
    return fetch('http://localhost:8000/api/v1/auth/signup/system', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    })
        .then(handleResponse)
        .then(token => {
            localStorage.setItem('token', JSON.stringify(token))
            return token;
        })
}

function logout() {
    // remove token from local storage to log user out.
    localStorage.removeItem('token');
}

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) {
                // auto logout if 401 response returned from api
                logout();
                window.location.reload(true);
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}