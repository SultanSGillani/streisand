import { Reducer } from 'redux';

import { combineReducers } from '../helpers';
import { IPage } from '../../models/base/IPagedItemSet';
import { getLoadingStatusReducer } from './loadingStatus';

// WARNING: We are abadoning type safety here, so be very careful.
// Ideally we wouldn't, but I don't know how to do this otherwise.
export function getPageReducer(id: string, getItems?: (action: any) => { id: number }[]): Reducer<IPage> {
    const receivedType = `RECEIVED_${id}`;

    function items(state: number[] = [], action: any) {
        switch (action.type) {
            case receivedType:
                const collection: { id: number; }[] = getItems ? getItems(action) : action.props.items;
                return collection.map((item: { id: number }) => {
                    return item.id;
                });
            default:
                return state;
        }
    }

    const status = getLoadingStatusReducer(id);
    return combineReducers<IPage>({ status, items });
}