import { userConstants } from '../_constants';
import { history } from '../_helpers';
import { userService } from '../_services';
import { alertActions } from './alert.actions';

export const userActions = {
    login,
    logout,
    register,
}

function login(nickname, password) {
    return dispatch => {
        dispatch({ type: userConstants.LOGIN_REQUEST, nickname })
        
        userService.login(nickname, password)
            .then(
                user => {
                    dispatch({ type: userConstants.LOGIN_SUCCESS, user })
                    history.push('/')
                },
                error => {
                    const errorStr = error.toString()
                    dispatch({ type: userConstants.LOGIN_FAILURE, errorStr })
                    dispatch(alertActions.error(errorStr))
                }
            )
    }
}

function logout() {
    userService.logout();
    return { type: userConstants.LOGOUT }
}

function register(user) {
    return dispatch => {
        dispatch({ type: userConstants.REGISTER_REQUEST, user });

        userService.register(user)
            .then(
                user => { 
                    dispatch({ type: userConstants.REGISTER_SUCCESS, user });
                    history.push('/chat');
                    dispatch(alertActions.success('Registration successful'));
                },
                error => {
                    dispatch({ type: userConstants.REGISTER_FAILURE, error });
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };
}
