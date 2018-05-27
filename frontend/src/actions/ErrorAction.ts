import { put } from 'redux-saga/effects';
import { replace } from 'react-router-redux';

import { logout } from './auth/LogoutAction';
import { IUnkownError } from '../models/base/IError';

type ErrorAction =
    { type: 'ADD_ERROR', message: string } |
    { type: 'REMOVE_ERROR', index: number };
export default ErrorAction;

export function removeError(index: number): ErrorAction {
    return { type: 'REMOVE_ERROR', index };
}

export function showError(message: string): ErrorAction {
    return { type: 'ADD_ERROR', message };
}

export function* handleError(error: IUnkownError, prefix?: string) {
    if (error.status === 401) {
        yield put(logout());
        yield put(showError('Authentication expired'));
        yield put(replace('/login'));
    } else {
        const label = prefix ? `${prefix}: ` : '';
        const message = `${label}${JSON.stringify(error.result)}`;
        yield put(showError(message));
    }
}