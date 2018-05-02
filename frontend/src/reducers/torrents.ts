import * as objectAssign from 'object-assign';

import Action from '../actions/torrents';
import ITorrent from '../models/ITorrent';
import { combineReducers } from './helpers';
import { IPage } from '../models/base/IPagedItemSet';
import { getPageReducer } from './utilities/reducers';
import ILoadingItem from '../models/base/ILoadingItem';
import ITorrentItemSet from '../models/ITorrentItemSet';

type ItemMap = { [id: number]: ITorrent | ILoadingItem };
function byId(state: ItemMap = {}, action: Action): ItemMap {
    switch (action.type) {
        case 'FETCHING_TORRENT':
            return objectAssign({}, state, { [action.id]: { loading: true } });
        case 'RECEIVED_TORRENT':
            return objectAssign({}, state, { [action.torrent.id]: action.torrent });
        case 'FAILED_TORRENT':
            return objectAssign({}, state, { [action.id]: undefined });
        case 'RECEIVED_TORRENTS':
        case 'RECEIVED_FILM_TORRENTS':
            let map: ItemMap = {};
            for (const item of action.items) {
                map[item.id] = item;
            }
            return objectAssign({}, state, map);
        default:
            return state;
    }
}

const pageReducer = getPageReducer<ITorrent>('TORRENTS');
type Pages = { [page: number]: IPage<ITorrent> };
function pages(state: Pages = {}, action: Action): Pages {
    switch (action.type) {
        case 'FETCHING_TORRENTS':
        case 'RECEIVED_TORRENTS':
        case 'FAILED_TORRENTS':
            const page: IPage<ITorrent> = pageReducer(state[action.page], action);
            return objectAssign({}, state, { [action.page]: page });
        default:
            return state;
    }
}

const filmPageReducer = getPageReducer<ITorrent>('FILM_TORRENTS');
type Torrents = { [id: number]: IPage<ITorrent> };
function byFilmId(state: Torrents = {}, action: Action): Torrents {
    switch (action.type) {
        case 'FETCHING_FILM_TORRENTS':
        case 'RECEIVED_FILM_TORRENTS':
        case 'FAILED_FILM_TORRENTS':
            const page: IPage<ITorrent> = filmPageReducer(state[action.page], action);
            return objectAssign({}, state, { [action.page]: page });
        default:
            return state;
    }
}

function count(state: number = 0, action: Action): number {
    switch (action.type) {
        case 'RECEIVED_TORRENTS':
            return action.count;
        default:
            return state;
    }
}

export default combineReducers<ITorrentItemSet>({ byId, byFilmId, count, pages });