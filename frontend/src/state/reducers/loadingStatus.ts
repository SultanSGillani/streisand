import { Reducer } from 'redux';

import { combineReducers } from './helpers';
import ILoadingStatus from '../../models/base/ILoadingStatus';

// WARNING: We are abadoning type safety here, so be very careful.
// Ideally we wouldn't, but I don't know how to do this otherwise.
export function getLoadingStatusReducer(id: string): Reducer<ILoadingStatus> {
    const fetchingType = `REQUEST_${id}`;
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

    function outdated(state: boolean = false, action: any) {
        switch (action.type) {
            case receivedType:
                return false;
            case failedType:
            case invalidateType:
                return true;
            default:
                return state;
        }
    }

    return combineReducers<ILoadingStatus>({ loading, loaded, failed, outdated });
}