import { push } from 'react-router-redux';
import { put } from 'redux-saga/effects';

import { invalidate } from './WikisAction';
import globals from '../../utilities/globals';
import { remove } from '../../utilities/Requestor';
import { generateSage, generateAuthFetch } from '../sagas/generators';

export interface IActionProps {
    id: number;
    currentPage?: number;
}

export type RequestWikiDeletion = { type: 'REQUEST_WIKI_DELETION', props: IActionProps };
export type ReceivedWikiDeletion = { type: 'RECEIVED_WIKI_DELETION', props: IActionProps };
export type FailedWikiDeletion = { type: 'FAILED_WIKI_DELETION', props: IActionProps };

type DeleteWikiAction = RequestWikiDeletion | ReceivedWikiDeletion | FailedWikiDeletion;
export default DeleteWikiAction;
type Action = DeleteWikiAction;

function* received(response: void, props: IActionProps) {
    yield put<Action>({ type: 'RECEIVED_WIKI_DELETION', props });
    if (props.currentPage) {
        yield put(invalidate({ page: props.currentPage }));
    } else {
        yield put(push('/wikis'));
    }
}

function failure(props: IActionProps): Action {
    return { type: 'FAILED_WIKI_DELETION', props };
}

export function deleteWiki(props: IActionProps): Action {
    return { type: 'REQUEST_WIKI_DELETION', props };
}

const errorPrefix = (props: IActionProps) => `Deleting a wiki (${props.id}) failed`;
const fetch = generateAuthFetch({ errorPrefix, request, received, failure });
export const deleteWikiSaga = generateSage<RequestWikiDeletion>('REQUEST_WIKI_DELETION', fetch);

function request(token: string, props: IActionProps): Promise<void> {
    return remove({ token, url: `${globals.apiUrl}/wikis/${props.id}/` });
}