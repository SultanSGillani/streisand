import { put } from 'redux-saga/effects';
import { push } from 'react-router-redux';

import globals from '../../../utilities/globals';
import { patch } from '../../../utilities/Requestor';
import { ITorrent } from '../../../models/ITorrent';
import { generateAuthFetch, generateSage } from '../../sagas/generators';

export interface IActionProps {
    id: number;
    filmId: number;
    releaseId: number;
}

export type RequestTorrentUpdate = { type: 'REQUEST_TORRENT_UPDATE', props: IActionProps };
export type ReceivedTorrentUpdate = { type: 'RECEIVED_TORRENT_UPDATE', torrent: ITorrent };
export type FailedTorrentUpdate = { type: 'FAILED_TORRENT_UPDATE', props: IActionProps };

type UpdateTorrentAction = RequestTorrentUpdate | ReceivedTorrentUpdate | FailedTorrentUpdate;
export default UpdateTorrentAction;
type Action = UpdateTorrentAction;

function* received(torrent: ITorrent, props: IActionProps) {
    yield put<Action>({ type: 'RECEIVED_TORRENT_UPDATE', torrent });
    yield put(push(`/film/${props.filmId}`));
}

function failure(props: IActionProps): Action {
    return { type: 'FAILED_TORRENT_UPDATE', props };
}

export function attachToRelease(props: IActionProps): Action {
    return { type: 'REQUEST_TORRENT_UPDATE', props };
}

const errorPrefix = (props: IActionProps) => `Updating the torrent (${props.id}) failed`;
const fetch = generateAuthFetch({ errorPrefix, request, received, failure });
export const updateTorrentSaga = generateSage<RequestTorrentUpdate>('REQUEST_TORRENT_UPDATE', fetch);

function request(token: string, props: IActionProps): Promise<ITorrent> {
    const { id, filmId, ...data } = props;
    return patch({ token, data, url: `${globals.apiUrl}/torrent-files/${props.id}/` });
}