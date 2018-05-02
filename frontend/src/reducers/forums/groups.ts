import * as objectAssign from 'object-assign';

import Action from '../../actions/forums';
import { combineReducers } from '../helpers';
import IForumGroup from '../../models/forums/IForumGroup';
import { ForumGroupData } from '../../models/forums/IForumData';

type ItemMap = { [id: number]: IForumGroup };
function byId(state: ItemMap = {}, action: Action): ItemMap {
    switch (action.type) {
        case 'RECEIVED_FORUM_GROUPS':
        case 'RECEIVED_FORUM_TOPIC':
            let map: ItemMap = {};
            for (const item of action.data.groups) {
                map[item.id] = item;
            }
            return objectAssign({}, state, map);
        default:
            return state;
    }
}

function items(state: IForumGroup[] = [], action: Action): IForumGroup[] {
    switch (action.type) {
        case 'RECEIVED_FORUM_GROUPS':
            return action.data.groups;
        default:
            return state;
    }
}

function loading(state: boolean = false, action: Action): boolean {
    switch (action.type) {
        case 'FETCHING_FORUM_GROUPS':
            return true;
        case 'FORUM_GROUPS_FAILURE':
        case 'RECEIVED_FORUM_GROUPS':
            return false;
        default:
            return state;
    }
}

export default combineReducers<ForumGroupData>({ byId, loading, items });