import { replace, RouterAction } from 'react-router-redux';

import { logout } from './auth/LogoutAction';
import { IUnkownError } from '../models/base/IError';
import { ThunkAction, IDispatch } from './ActionTypes';

type ErrorAction =
    { type: 'ADD_ERROR', message: string } |
    { type: 'REMOVE_ERROR', index: number };
export default ErrorAction;

type Action = ErrorAction | RouterAction;

export function removeError(index: number): ErrorAction {
    return { type: 'REMOVE_ERROR', index };
}

export function showError(message: string): ErrorAction {
    return { type: 'ADD_ERROR', message };
}

export function handleError(error: IUnkownError, prefix?: string): ThunkAction<Action> {
    return (dispatch: IDispatch<Action>) => {
        if (error.status === 401) {
            dispatch(logout());
            dispatch(showError('Authentication expired'));
            return dispatch(replace('/login'));
        }
        const label = prefix ? `${prefix}: ` : '';
        const message = `${label}${JSON.stringify(error.result)}`;
        return dispatch(showError(message));
    };
}