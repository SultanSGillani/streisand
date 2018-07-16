
import { ICurrentUserStore } from './store';
import Action from './actions/CurrentUserAction';
import { combineReducers } from '../reducers/helpers';

function id(state: number | null = null, action: Action): number | null {
    switch (action.type) {
        case 'RECEIVED_CURRENT_USER':
            return action.user.id;
        default:
            return state;
    }
}

function loading(state: boolean = false, action: Action): boolean {
    switch (action.type) {
        case 'RECEIVED_CURRENT_USER':
            return false;
        case 'REQUEST_CURRENT_USER':
            return true;
        default:
            return state;
    }
}

export default combineReducers<ICurrentUserStore>({ id, loading });