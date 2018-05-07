import * as objectAssign from 'object-assign';

import Store from '../store';
import IFilm from '../models/IFilm';
import Action from '../actions/films';
import { combineReducers } from './helpers';
import { getPageReducer } from './utilities/page';
import { IPage, INodeMap } from '../models/base/IPagedItemSet';
import { addLoadedNode, addLoadedNodes, markLoading, markFailed } from './utilities/mutations';

type ItemMap = INodeMap<IFilm>;
function byId(state: ItemMap = {}, action: Action): ItemMap {
    switch (action.type) {
        case 'FETCHING_FILM':
            return markLoading(state, action.id);
        case 'RECEIVED_FILM':
            return addLoadedNode(state, action.film);
        case 'FAILED_FILM':
            return markFailed(state, action.id);
        case 'RECEIVED_FILMS':
            return addLoadedNodes(state, action.items);
        default:
            return state;
    }
}

const pageReducer = getPageReducer('FILMS');
type Pages = { [page: number]: IPage };
function pages(state: Pages = {}, action: Action): Pages {
    switch (action.type) {
        case 'FETCHING_FILMS':
        case 'RECEIVED_FILMS':
        case 'FAILED_FILMS':
            const page: IPage = pageReducer(state[action.page], action);
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