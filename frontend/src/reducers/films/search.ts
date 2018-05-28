import * as objectAssign from 'object-assign';

import Action from '../../actions/films';
import { combineReducers } from '../helpers';
import { getPageReducer } from '../utilities/page';
import { IPage, INestedPage } from '../../models/base/IPagedItemSet';

const pageReducer = getPageReducer('FILM_SEARCH');
type Pages = { [page: number]: IPage };
function pages(state: Pages = {}, action: Action): Pages {
    switch (action.type) {
        case 'REQUEST_FILM_SEARCH':
        case 'RECEIVED_FILM_SEARCH':
        case 'FAILED_FILM_SEARCH':
            const page: IPage = pageReducer(state[action.props.page], action);
            return objectAssign({}, state, { [action.props.page]: page });
        default:
            return state;
    }
}

function pageSize(state: number = 0, action: Action): number {
    switch (action.type) {
        case 'RECEIVED_FILM_SEARCH':
            return action.props.pageSize;
        default:
            return state;
    }
}

function count(state: number = 0, action: Action): number {
    switch (action.type) {
        case 'RECEIVED_FILM_SEARCH':
            return action.props.count;
        default:
            return state;
    }
}

export default combineReducers<INestedPage>({ count, pageSize, pages });