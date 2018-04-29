import { RouterAction, LocationActionPayload, LOCATION_CHANGE } from 'react-router-redux';

import AuthAction from '../actions/auth/AuthAction';
import ILocationInfo, { ILocation } from '../models/ILocationInfo';

interface IPayload extends LocationActionPayload, ILocation {
    action: string;
}

// RouterAction type from react-router-redux is not typed correctly
export interface IRouterAction extends RouterAction {
    payload?: IPayload;
}

type Action = AuthAction | IRouterAction;

const defaultValue: ILocationInfo = {
    referred: false,
    referrer: { hash: '', pathname: '/', query: {}, search: '' }
};

function _location(state: ILocationInfo = defaultValue, action: IRouterAction): ILocationInfo {
    const payload = action.payload;
    if (payload) {
        if (payload.action === 'POP') {
            return {
                referred: false,
                previous: {
                    hash: payload.hash,
                    pathname: payload.pathname,
                    query: payload.query,
                    search: payload.search
                }
            };
        } else if (state.previous && payload.action === 'REPLACE' && payload.pathname === '/login') {
            return {
                referred: false,
                referrer: state.previous
            };
        }
    }
    return state;
}

function location(state: ILocationInfo = defaultValue, action: Action): ILocationInfo {
    if (state.referred) {
        return state;
    }

    if (action.type === 'AUTHENTICATED') {
        return { referred: true };
    }

    if (action.type === LOCATION_CHANGE) {
        return _location(state, <IRouterAction>action);
    }

    return state;
}

export default location;