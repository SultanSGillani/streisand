import * as objectAssign from 'object-assign';

import { combineReducers } from '../helpers';
import ForumAction from '../../actions/forums';
import NewsAction from '../../actions/NewsAction';
import ILoadingItem from '../../models/base/ILoadingItem';
import { IForumTopic } from '../../models/forums/IForumTopic';
import { ForumTopicData } from '../../models/forums/IForumData';

type Action = ForumAction | NewsAction;

type ItemMap = { [id: number]: ILoadingItem | IForumTopic };
function byId(state: ItemMap = {}, action: Action): ItemMap {
    switch (action.type) {
        case 'FETCHING_FORUM_TOPIC':
            return objectAssign({}, state, {
                [action.id]: {
                    loading: true
                }
            });
        case 'FORUM_TOPIC_FAILURE':
            return objectAssign({}, state, {
                [action.id]: {
                    loading: false
                }
            });
        case 'RECEIVED_FORUM_GROUPS':
        case 'RECEIVED_FORUM_TOPIC':
        case 'RECEIVED_FORUM_THREAD':
        case 'RECEIVED_NEWS_POST':
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