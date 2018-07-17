import { put } from 'redux-saga/effects';
import { replace } from 'react-router-redux';

import guid from '../../../utilities/guid';
import IMessage from '../../../models/IMessage';
import { IUnkownError } from '../../../models/base/IError';
import { loggedOut } from '../../auth/actions/LoggedOutAction';
import { storeCurrentLocation } from '../../location/actions/LocationAction';

type MessageAction =
    { type: 'ADD_MESSAGE', message: IMessage } |
    { type: 'REMOVE_MESSAGE', id: string };
export default MessageAction;

export function removeError(id: string): MessageAction {
    return { type: 'REMOVE_MESSAGE', id };
}

export function showError(message: string): MessageAction {
    return {
        type: 'ADD_MESSAGE',
        message: {
            id: guid(),
            level: 'danger',
            content: message
        }
    };
}

export function* handleError(error: IUnkownError, prefix?: string) {
    if (error.status === 401) {
        yield storeCurrentLocation();
        yield loggedOut();
        yield put(showError('Authentication expired'));
        yield put(replace('/login'));
    } else {
        const label = prefix ? `${prefix}: ` : '';
        const message = `${label}${JSON.stringify(error.result)}`;
        yield put(showError(message));
    }
}