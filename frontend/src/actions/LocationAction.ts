import { Location } from 'history';
import { put, select } from 'redux-saga/effects';

import Store from '../store';

export type StoreLocation = { type: 'STORE_LOCATION', location: Location };

type LocationAction = StoreLocation;
export default LocationAction;
type Action = LocationAction;

export function* storeCurrentLocation() {
    const state: Store.All = yield select();
    const location = state.routing.locationBeforeTransitions;
    yield put<Action>({ type: 'STORE_LOCATION', location });
}