import * as objectAssign from 'object-assign';

import Action from '../actions/torrents';
import ITorrent from '../models/ITorrent';
import { combineReducers } from './helpers';
import { IPage } from '../models/base/IPagedItemSet';
import ILoadingItem from '../models/base/ILoadingItem';
import ITorrentItemSet from '../models/ITorrentItemSet';

type ItemMap = { [id: number]: ITorrent | ILoadingItem };
function byId(state: ItemMap = {}, action: Action): ItemMap {
    switch (action.type) {
        case 'FETCHING_TORRENT':
            return objectAssign({}, state, { [action.id]: { loading: true } });
        case 'RECEIVED_TORRENT':
            return objectAssign({}, state, { [action.torrent.id]: action.torrent });
        case 'TORRENT_FAILURE':
            return objectAssign({}, state, { [action.id]: undefined });
        case 'RECEIVED_TORRENTS':
        case 'RECEIVED_FILM_TORRENTS':
            let map: ItemMap = {};
            for (const item of action.torrents) {
                map[item.id] = item;
            }
            return objectAssign({}, state, map);
        default:
            return state;
    }
}

type Pages = { [page: number]: IPage<ITorrent> };
function pages(state: Pages = {}, action: Action): Pages {
    let page: IPage<ITorrent>;
    switch (action.type) {
        case 'FETCHING_TORRENTS':
            page = objectAssign({ items: [] }, state[action.page], { loading: true });
            return objectAssign({}, state, { [action.page]: page });
        case 'RECEIVED_TORRENTS':
            page = { loading: false, items: action.torrents };
            return objectAssign({}, state, { [action.page]: page });
        case 'TORRENTS_FAILURE':
            page = objectAssign({ items: [] }, state[action.page], { loading: false });
            return objectAssign({}, state, { [action.page]: page });
        default:
            return state;
    }
}

type Torrents = { [id: number]: IPage<ITorrent> };
function byFilmId(state: Torrents = {}, action: Action): Torrents {
    let page: IPage<ITorrent>;
    switch (action.type) {
        case 'FETCHING_FILM_TORRENTS':
            page = objectAssign({ items: [] }, state[action.id], { loading: true });
            return objectAssign({}, state, { [action.id]: page });
        case 'RECEIVED_FILM_TORRENTS':
            page = { loading: false, items: action.torrents };
            return objectAssign({}, state, { [action.id]: page });
        case 'TORRENTS_FILM_FAILURE':
            page = objectAssign({ items: [] }, state[action.id], { loading: false });
            return objectAssign({}, state, { [action.id]: page });
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