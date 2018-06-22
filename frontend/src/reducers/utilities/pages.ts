import { Reducer } from 'redux';
import * as objectAssign from 'object-assign';

import { getPageReducer } from './page';
import { combineReducers } from '../helpers';
import { IItemPage, IItemPages } from '../../models/base/IPagedItemSet';

// WARNING: We are abadoning type safety here, so be very careful.
// Ideally we wouldn't, but I don't know how to do this otherwise.
export function getPagesReducer(id: string): Reducer<IItemPages> {
    const pageReducer = getPageReducer(id);

    const fetchingType = `REQUEST_${id}`;
    const receivedType = `RECEIVED_${id}`;
    const failedType = `FAILED_${id}`;
    const invalidateType = `INVALIDATE_${id}`;

    type Pages = { [page: number]: IItemPage };
    function pages(state: Pages = {}, action: any): Pages {
        switch (action.type) {
            case fetchingType:
            case receivedType:
            case failedType:
            case failedType:
            case invalidateType:
                const page: IItemPage = pageReducer(state[action.props.page], action);
                return objectAssign({}, state, { [action.props.page]: page });
            default:
                return state;
        }
    }

    function pageSize(state: number = 0, action: any): number {
        switch (action.type) {
            case receivedType:
                return action.props.pageSize;
            default:
                return state;
        }
    }

    function count(state: number = 0, action: any): number {
        switch (action.type) {
            case receivedType:
                return action.props.count;
            default:
                return state;
        }
    }

    return combineReducers<IItemPages>({ count, pageSize, pages });
}