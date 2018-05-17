import * as objectAssign from 'object-assign';

import Action from '../../actions/forums';
import { combineReducers } from '../helpers';
import { IForumTopic } from '../../models/forums/IForumTopic';
import { ForumTopicData } from '../../models/forums/IForumData';

type ItemMap = { [id: number]: IForumTopic };
function byId(state: ItemMap = {}, action: Action): ItemMap {
    switch (action.type) {
        case 'RECEIVED_FORUM_GROUPS':
        case 'RECEIVED_FORUM_TOPIC':
        case 'RECEIVED_FORUM_THREAD':
            let map: ItemMap = {};
            for (const item of action.data.topics) {
                map[item.id] = item;
            }
            return objectAssign({}, state, map);
        default:
            return state;
    }
}

export default combineReducers<ForumTopicData>({ byId });