import { put } from 'redux-saga/effects';

import globals from '../../../utilities/globals';
import { remove } from '../../../utilities/Requestor';
import { generateSage, generateAuthFetch } from '../../sagas/generators';
import { invalidate as invalidateRelease } from './ReleaseTorrentsAction';
import { invalidate as invalidateDetached } from './DetachedTorrentsAction';

export interface IActionProps {
    id: number;
    release?: number;
    currentPage?: number;
}

export type RequestTorrentDeletion = { type: 'REQUEST_TORRENT_DELETION', props: IActionProps };
export type ReceivedTorrentDeletion = { type: 'RECEIVED_TORRENT_DELETION', props: IActionProps };
export type FailedTorrentDeletion = { type: 'FAILED_TORRENT_DELETION', props: IActionProps };

type DeleteTorrentAction = RequestTorrentDeletion | ReceivedTorrentDeletion | FailedTorrentDeletion;
export default DeleteTorrentAction;
type Action = DeleteTorrentAction;

function* received(response: void, props: IActionProps) {
    yield put<Action>({ type: 'RECEIVED_TORRENT_DELETION', props });
    if (props.currentPage) {
        yield put(invalidateDetached({ page: props.currentPage }));
    } else if (props.release) {
        yield put(invalidateRelease({ page: props.currentPage || 1, id: props.release }));
    }
}

function failure(props: IActionProps): Action {
    return { type: 'FAILED_TORRENT_DELETION', props };
}

export function deleteTorrent(props: IActionProps): Action {
    return { type: 'REQUEST_TORRENT_DELETION', props };
}

const errorPrefix = (props: IActionProps) => `Deleting a torrent (${props.id}) failed`;
const fetch = generateAuthFetch({ errorPrefix, request, received, failure });
export const deleteTorrentSaga = generateSage<RequestTorrentDeletion>('REQUEST_TORRENT_DELETION', fetch);

function request(token: string, props: IActionProps): Promise<void> {
    return remove({ token, url: `${globals.apiUrl}/torrent-files/${props.id}/` });
}