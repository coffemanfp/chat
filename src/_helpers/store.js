import { configureStore } from '@reduxjs/toolkit'
import { alert as alertReducer } from '../_reducers';
import { login as loginReducer } from '../_reducers';
import { registration as registrationReducer } from '../_reducers';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

export default configureStore({
  reducer: {
    alertReducer,
    loginReducer,
    registrationReducer,
  },
  middleware: [thunk, logger]
});