import * as objectAssign from 'object-assign';

import Action from '../actions/torrents';
import ITorrent from '../models/ITorrent';
import { combineReducers } from './helpers';
import { INodeMap } from '../models/base/ItemSet';
import { getPagesReducer } from './utilities/pages';
import ITorrentItemSet from '../models/ITorrentItemSet';
import { IItemPages } from '../models/base/IPagedItemSet';
import { addLoadedNode, addLoadedNodes, markLoading, markFailed } from './utilities/mutations';

type ItemMap = INodeMap<ITorrent>;
function byId(state: ItemMap = {}, action: Action): ItemMap {
    switch (action.type) {
        case 'REQUEST_TORRENT':
            return markLoading(state, action.props.id);
        case 'RECEIVED_TORRENT':
        case 'RECEIVED_TORRENT_UPLOAD':
            return addLoadedNode(state, action.torrent);
        case 'FAILED_TORRENT':
            return markFailed(state, action.props.id);
        case 'RECEIVED_DETACHED_TORRENTS':
        case 'RECEIVED_FILM_TORRENTS':
            return addLoadedNodes(state, action.props.items);
        default:
            return state;
    }
}

const filmPagesReducer = getPagesReducer('FILM_TORRENTS');
type Torrents = { [id: number]: IItemPages };
function byFilmId(state: Torrents = {}, action: Action): Torrents {
    switch (action.type) {
        case 'REQUEST_FILM_TORRENTS':
        case 'RECEIVED_FILM_TORRENTS':
        case 'FAILED_FILM_TORRENTS':
        case 'INVALIDATE_FILM_TORRENTS':
            const currentItemSet = state[action.props.id];
            const newItemSet = filmPagesReducer(currentItemSet, action);
            return objectAssign({}, state, { [action.props.id]: newItemSet });
        default:
            return state;
    }
}

const detached = getPagesReducer('DETACHED_TORRENTS');
export default combineReducers<ITorrentItemSet>({ byId, byFilmId, detached });