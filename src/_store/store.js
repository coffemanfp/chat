import { configureStore } from '@reduxjs/toolkit'
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { authReducer } from './auth.slice';
import { alertReducer } from './alert.slice';

export const store =  configureStore({
  reducer: {
    alert: alertReducer,
    auth: authReducer,
  },
  middleware: [thunk, logger]
});