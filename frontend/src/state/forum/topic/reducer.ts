import * as objectAssign from 'object-assign';

import Action from '../actions';
import { IForumTopicStore } from './store';
import { combineReducers } from '../../reducers/helpers';
import { IForumTopic } from '../../../models/forums/IForumTopic';

type ItemMap = { [id: number]: IForumTopic };
function byId(state: ItemMap = {}, action: Action): ItemMap {
    switch (action.type) {
        case 'RECEIVED_FORUM_GROUPS':
        case 'RECEIVED_FORUM_TOPIC':
        case 'RECEIVED_FORUM_THREAD':
            let map: ItemMap = {};
            for (const item of action.props.data.topics) {
                map[item.id] = item;
            }
            return objectAssign({}, state, map);
        default:
            return state;
    }
}

export default combineReducers<IForumTopicStore>({ byId });