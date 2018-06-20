import * as assign from 'object-assign';

import Action from '../actions/auth';
import IAuthInfo from '../models/IAuthInfo';
import { getAuthToken } from '../utilities/storage';

const authToken = getAuthToken();
const defaultValue: IAuthInfo = {
    isAuthenticated: !!authToken,
    isAuthenticating: false,
    token: authToken
};

function auth(state: IAuthInfo = defaultValue, action: Action): IAuthInfo {
    switch (action.type) {
        case 'RECEIVED_LOGOUT':
        case 'FAILED_AUTHENTICATION':
            return {
                isAuthenticated: false,
                isAuthenticating: false,
                token: ''
            };
        case 'REQUEST_AUTHENTICATION':
            return assign({}, state, { isAuthenticating: true });
        case 'RECEIVED_AUTHENTICATION':
        case 'RECEIVED_REGISTRATION':
            return {
                isAuthenticated: true,
                isAuthenticating: false,
                token: action.token
            };
        default:
            return state;
    }
}

export default auth;