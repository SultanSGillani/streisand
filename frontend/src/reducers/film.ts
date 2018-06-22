import * as objectAssign from 'object-assign';

import Store from '../store';
import IFilm from '../models/IFilm';
import FilmAction from '../actions/films';
import { combineReducers } from './helpers';
import { INodeMap } from '../models/base/ItemSet';
import { getPagesReducer } from './utilities/pages';
import ReleasesAction from '../actions/releases/ReleasesAction';
import { addLoadedNode, addLoadedNodes, markLoading, markFailed } from './utilities/mutations';

type Action = FilmAction | ReleasesAction;

type ItemMap = INodeMap<IFilm>;
function byId(state: ItemMap = {}, action: Action): ItemMap {
    switch (action.type) {
        case 'RECEIVED_FILM_DELETION':
            const copy = objectAssign({}, state);
            delete copy[action.props.id];
            return copy;
        case 'REQUEST_FILM':
            return markLoading(state, action.props.id);
        case 'RECEIVED_FILM':
            return addLoadedNode(state, action.film);
        case 'FAILED_FILM':
            return markFailed(state, action.props.id);
        case 'RECEIVED_RELEASES':
            return addLoadedNodes(state, action.films);
        case 'RECEIVED_FILMS':
        case 'RECEIVED_FILM_SEARCH':
            return addLoadedNodes(state, action.props.items);
        default:
            return state;
    }
}

const list = getPagesReducer('FILMS');
const search = getPagesReducer('FILM_SEARCH');
export default combineReducers<Store.Films>({ byId, list, search });