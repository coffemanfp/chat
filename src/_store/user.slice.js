import { createAsyncThunk } from "@reduxjs/toolkit";
import { get } from "immer/dist/internal";
import { authConstants } from "../_constants";

const extraActions = createExtraActions();
const slice = createSlice({
    name: "user",
    initialState: createInitialState(),
    extraReducers: createExtraReducers(),
})

function createInitialState() {
    return {
        user: JSON.parse(localStorage.getItem('user')),
        error: null,
    }
}

function createExtraActions() {
    const baseUrl = 'http://localhost:8000/api/v1/users'

    return {
        get: get(),
    }

    function get() {
        return createAsyncThunk(
            userConstants.GET_REQUEST,
            async ()
        )
    }
}
