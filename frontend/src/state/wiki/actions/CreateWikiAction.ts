import { put } from 'redux-saga/effects';
import { push } from 'react-router-redux';

import globals from '../../../utilities/globals';
import { post } from '../../../utilities/Requestor';
import IWiki, { IWikiUpdate } from '../../../models/IWiki';
import { generateSage, generateAuthFetch } from '../../sagas/generators';

interface IActionProps extends IWikiUpdate { }

export type RequestNewWiki = { type: 'REQUEST_NEW_WIKI', props: IActionProps };
export type ReceivedNewWiki = { type: 'RECEIVED_NEW_WIKI', wiki: IWiki };
export type FailedNewWiki = { type: 'FAILED_NEW_WIKI', props: IActionProps };

type CreateWikiAction = RequestNewWiki | ReceivedNewWiki | FailedNewWiki;
export default CreateWikiAction;
type Action = CreateWikiAction;

function* received(wiki: IWiki) {
    yield put<Action>({ type: 'RECEIVED_NEW_WIKI', wiki });
    yield put(push(`/wiki/${wiki.id}`));
}

function failure(props: IActionProps): Action {
    return { type: 'FAILED_NEW_WIKI', props };
}

export function createWiki(props: IWikiUpdate): Action {
    return { type: 'REQUEST_NEW_WIKI', props };
}

const errorPrefix = 'Creating a new wiki failed';
const fetch = generateAuthFetch({ errorPrefix, request, received, failure });
export const createWikiSaga = generateSage<RequestNewWiki>('REQUEST_NEW_WIKI', fetch);

function request(token: string, data: IActionProps): Promise<IWiki> {
    return post({ token, data, url: `${globals.apiUrl}/wikis/` });
}