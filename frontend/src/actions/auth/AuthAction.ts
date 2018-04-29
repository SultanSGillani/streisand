import { replace } from 'react-router-redux';

import Store from '../../store';
import globals from '../../utilities/globals';
import { post } from '../../utilities/Requestor';
import { IUnkownError } from '../../models/base/IError';
import { ThunkAction, IDispatch } from '../ActionTypes';
import { storeAuthToken } from '../../utilities/storage';
import ErrorAction, { handleError } from '../ErrorAction';

type AuthAction =
    { type: 'AUTHENTICATING' } |
    { type: 'AUTHENTICATED', token: string } |
    { type: 'AUTHENTICATION_FAILED', message: string };
export default AuthAction;
type Action = AuthAction | ErrorAction;

function authenticating(): Action {
    return { type: 'AUTHENTICATING' };
}

function authenticated(token: string): Action {
    return {
        type: 'AUTHENTICATED',
        token: token
    };
}

export function login(username: string, password: string): ThunkAction<Action> {
    return (dispatch: IDispatch<Action>, getState: () => Store.All) => {
        const state = getState();
        dispatch(authenticating());
        return request(username, password).then((result: { token: string }) => {
            storeAuthToken(result.token);
            const action = dispatch(authenticated(result.token));
            if (state.location.referrer) {
                dispatch(replace(state.location.referrer));
            } else {
                dispatch(replace('/'));
            }
            return action;
        }, (error: IUnkownError) => {
            return dispatch(handleError(error, 'Login failed'));
        });
    };
}

function request(username: string, password: string): Promise<{ token: string }> {
    const data = { username, password };
    return post({ data, url: `${globals.apiUrl}/login/` });
}
