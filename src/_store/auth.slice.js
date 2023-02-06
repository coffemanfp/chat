import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authConstants } from "../_constants";
import { history, fetchWrapper } from '../_helpers';

const extraActions = createExtraActions();
const slice = createSlice({
    name: 'auth',
    initialState: createInitialState(),
    reducers: createReducers(),
    extraReducers: createExtraReducers(),
})

function createInitialState() {
    return {
        token: JSON.parse(localStorage.getItem('token')),
        error: null
    }
}

function createReducers() {
    return {
        logout
    };

    function logout(state) {
        state.token = null;
        localStorage.removeItem('token');
        // history.navigate('/login');
    }
}

function createExtraActions() {
    const baseUrl = 'http://localhost:8000/api/v1/auth';

    return {
        login: login(),
        signup: signup(),
    };

    function login() {
        return createAsyncThunk(
            authConstants.LOGIN_REQUEST,
            async ({ email, password }) => await fetchWrapper.post(`${baseUrl}/login`, { email, password })
        );
    }
    function signup() {
        return createAsyncThunk(
            authConstants.REGISTER_REQUEST,
            async (user) => await fetchWrapper.post(`${baseUrl}/signup`, user)
        )
    }
}

function createExtraReducers() {
    return {
        ...login(),
        ...signup(),
    };

    function login() {
        var { pending, fulfilled, rejected } = extraActions.login;
        return signin(pending, fulfilled, rejected)
    }

    function signup() {
        var { pending, fulfilled, rejected } = extraActions.signup;
        return signin(pending, fulfilled, rejected)
    }

    function signin(pending, fulfilled, rejected) {
        return {
            [pending]: state => {
                state.error = null;
            },
            [fulfilled]: (state, action) => {

                const token = action.payload;
                console.log("LOG: token", token)

                localStorage.setItem('token', JSON.stringify(token));
                state.token = token;
                // const { from } = history.location.state || { from: { pathname: '/login' } };
                // history.replace(from)
            },
            [rejected]: (state, action) => {
                state.error = action.error;
            }
        }
    }
}

export const authActions = { ...slice.actions, ...extraActions };
export const authReducer = slice.reducer;