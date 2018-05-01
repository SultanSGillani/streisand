import { push } from 'react-router-redux';

import Store from '../../store';
import globals from '../../utilities/globals';
import { post } from '../../utilities/Requestor';
import { ThunkAction, IDispatch } from '../ActionTypes';

import WikiAction from './WikiAction';
import IWiki, { IWikiUpdate } from '../../models/IWiki';
import { IUnkownError } from '../../models/base/IError';
import ErrorAction, { handleError } from '../ErrorAction';

type CreateWikiAction =
    { type: 'CREATING_WIKI', wiki: IWikiUpdate } |
    { type: 'CREATED_WIKI', id: number } |
    { type: 'WIKI_CREATION_FAILURE' };
export default CreateWikiAction;
type Action = CreateWikiAction | WikiAction | ErrorAction;

function received(id: number, response: IWiki): Action {
    return {
        type: 'RECEIVED_WIKI',
        wiki: response
    };
}

function creating(wiki: IWikiUpdate) {
    return { type: 'CREATING_WIKI', wiki };
}

function created(id: number): Action {
    return { type: 'CREATED_WIKI', id };
}

function failure(): Action {
    return { type: 'WIKI_CREATION_FAILURE' };
}

export function createWiki(wiki: IWikiUpdate): ThunkAction<Action> {
    return (dispatch: IDispatch<Action>, getState: () => Store.All) => {
        const state = getState();
        dispatch(creating(wiki));
        return request(state.sealed.auth.token, wiki).then((response: IWiki) => {
            dispatch(received(response.id, response));
            const action = dispatch(created(response.id));
            dispatch(push(`/wiki/${response.id}`));
            return action;
        }, (error: IUnkownError) => {
            dispatch(failure());
            return dispatch(handleError(error));
        });
    };
}

function request(token: string, data: IWikiUpdate): Promise<IWiki> {
    return post({ token, data, url: `${globals.apiUrl}/wikis/` });
}