import { userConstants } from '../_constants';

let token = JSON.parse(localStorage.getItem('token'));
const initialState = token ? { loggedIn: true, token: token } : {};

export function login(state = initialState, action) {
  switch (action.type) {
    case userConstants.LOGIN_REQUEST:
      return {
        loggingIn: true,
        token: action.token
      };
    case userConstants.LOGIN_SUCCESS:
      return {
        loggedIn: true,
        token: action.token
      };
    case userConstants.LOGIN_FAILURE:
    case userConstants.LOGOUT:
      return {};
    default:
      return state
  }
}