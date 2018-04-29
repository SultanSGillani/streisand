import { push } from 'react-router-redux';

import Store from '../../store';
import globals from '../../utilities/globals';
import { remove } from '../../utilities/Requestor';
import { ThunkAction, IDispatch } from '../ActionTypes';

import WikiAction from './WikiAction';
import { IUnkownError } from '../../models/base/IError';
import ErrorAction, { handleError } from '../ErrorAction';

type RemoveWikiAction = { type: 'REMOVED_WIKI', id: number };
export default RemoveWikiAction;
type Action = RemoveWikiAction | WikiAction | ErrorAction;

function removed(id: number): Action {
    return { type: 'REMOVED_WIKI', id };
}

function failure(id: number): Action {
    return { type: 'WIKI_FAILURE', id };
}

export function removeWiki(id: number): ThunkAction<Action> {
    return (dispatch: IDispatch<Action>, getState: () => Store.All) => {
        const state = getState();
        return request(state.sealed.auth.token, id).then(() => {
            dispatch(push('/wikis'));
            return dispatch(removed(id));
        }, (error: IUnkownError) => {
            dispatch(failure(id));
            return dispatch(handleError(error));
        });
    };
}

function request(token: string, id: number): Promise<void> {
    return remove({ token, url: `${globals.apiUrl}/wikis/${id}/` });
}