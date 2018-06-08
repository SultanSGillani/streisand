import * as objectAssign from 'object-assign';

import Store from '../store';
import { combineReducers } from './helpers';
import ITorrentFileInfo from '../models/ITorrentFileInfo';
import Action from '../actions/torrents/UploadTorrentAction';
import ILoadingStatus, { defaultStatus } from '../models/base/ILoadingStatus';

function status(state: ILoadingStatus = defaultStatus, action: Action): ILoadingStatus {
    switch (action.type) {
        case 'REQUEST_TORRENT_UPLOAD':
            return objectAssign({}, state, { loading: true });
        case 'RECEIVED_TORRENT_UPLOAD':
            return objectAssign({}, state, { loading: false, loaded: true, failed: false, outdated: false });
        case 'FAILED_TORRENT_UPLOAD':
            return objectAssign({}, state, { loading: false, failed: true });
        default:
            return state;
    }
}

function item(state: ITorrentFileInfo | null = null, action: Action): ITorrentFileInfo | undefined {
    switch (action.type) {
        case 'RECEIVED_TORRENT_UPLOAD':
            return action.item;
        default:
            return state as ITorrentFileInfo | undefined;
    }
}

export default combineReducers<Store.TorrentUpload>({ status, item });