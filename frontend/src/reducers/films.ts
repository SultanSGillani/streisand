import * as objectAssign from 'object-assign';

import Store from '../store';
import IFilm from '../models/IFilm';
import Action from '../actions/films';
import { combineReducers } from './helpers';
import { IPage } from '../models/base/IPagedItemSet';
import { getPageReducer } from './utilities/reducers';
import ILoadingItem from '../models/base/ILoadingItem';

type ItemMap = { [id: number]: IFilm | ILoadingItem };
function byId(state: ItemMap = {}, action: Action): ItemMap {
    switch (action.type) {
        case 'FETCHING_FILM':
            return objectAssign({}, state, { [action.id]: { loading: true } });
        case 'RECEIVED_FILM':
            return objectAssign({}, state, { [action.film.id]: action.film });
        case 'FAILED_FILM':
            return objectAssign({}, state, { [action.id]: undefined });
        case 'RECEIVED_FILMS':
            let map: ItemMap = {};
            for (const item of action.items) {
                map[item.id] = item;
            }
            return objectAssign({}, state, map);
        default:
            return state;
    }
}

const pageReducer = getPageReducer<IFilm>('FILMS');
type Pages = { [page: number]: IPage<IFilm> };
function pages(state: Pages = {}, action: Action): Pages {
    switch (action.type) {
        case 'FETCHING_FILMS':
        case 'RECEIVED_FILMS':
        case 'FAILED_FILMS':
            const page: IPage<IFilm> = pageReducer(state[action.page], action);
            return objectAssign({}, state, { [action.page]: page });
        default:
            return state;
    }
}

function count(state: number = 0, action: Action): number {
    switch (action.type) {
        case 'RECEIVED_FILMS':
            return action.count;
        default:
            return state;
    }
}

export default combineReducers<Store.Films>({ byId, pages, count });