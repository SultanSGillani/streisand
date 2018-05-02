import { Reducer } from 'redux';

import { combineReducers } from '../helpers';
import { IPage } from '../../models/base/IPagedItemSet';

// WARNING: We are abadoning type safety here, so be very careful.
// Ideally we wouldn't, but I don't know how to do this otherwise.
export function getPageReducer<T>(id: string, getItems?: (action: any) => T[]): Reducer<IPage<T>> {
    const fetchingType = `FETCHING_${id}`;
    const receivedType = `RECEIVED_${id}`;
    const failedType = `FAILED_${id}`;
    const invalidateType = `INVALIDATE_${id}`;

    function loading(state: boolean = false, action: any) {
        switch (action.type) {
            case fetchingType:
                return true;
            case receivedType:
            case failedType:
                return false;
            default:
                return state;
        }
    }

    function loaded(state: boolean = false, action: any) {
        switch (action.type) {
            case receivedType:
                return true;
            case invalidateType:
                return false;
            default:
                return state;
        }
    }

    function failed(state: boolean = false, action: any) {
        switch (action.type) {
            case receivedType:
                return false;
            case failedType:
                return true;
            default:
                return state;
        }
    }

    function items(state: T[] = [], action: any) {
        switch (action.type) {
            case receivedType:
                return getItems ? getItems(action) : action.items;
            default:
                return state;
        }
    }

    return combineReducers<IPage<T>>({ loading, loaded, failed, items });
}