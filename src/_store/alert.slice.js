import { createSlice } from "@reduxjs/toolkit";

function createInitialState() {
    return {
        message: null,
        type: null,
        datetime: null,
    }
}

const slice = createSlice({
    name: 'alert',
    initialState: createInitialState(),
    reducers: createReducers(),
});

function createReducers() {
    const newMessage = {
        reducer(state, action) {
            console.log('New message')
            const { message, type, datetime } = action.payload
            state.message = message
            state.type = type
            state.datetime = datetime
        },
        prepare(message, type, datetime) {
            return {
                payload: { message, type, datetime }
            }
        }
    }

    function clear(state) {
        console.log('Cleaned state')
        state = {
            message: null,
            type: null,
            datetime: null,
        }
    }
    return {
        newMessage,
        clear,
    }
}

export const alertActions = { ...slice.actions };
export const alertReducer = slice.reducer;