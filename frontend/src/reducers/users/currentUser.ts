
import Store from '../../store';
import { combineReducers } from '../helpers';
import Action from '../../actions/users/CurrentUserAction';

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
        case 'FETCHING_CURRENT_USER':
            return true;
        default:
            return state;
    }
}

export default combineReducers<Store.CurrentUser>({ id, loading });