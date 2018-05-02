import * as objectAssign from 'object-assign';

import { combineReducers } from '../helpers';
import ForumAction from '../../actions/forums';
import NewsAction from '../../actions/NewsAction';
import { getPageReducer } from '../utilities/reducers';
import { INestedPages } from '../../models/base/IPagedItemSet';
import { IForumThread } from '../../models/forums/IForumThread';
import { ForumThreadData } from '../../models/forums/IForumData';
import ForumTopicAction, { ForumTopicReceivedAction } from '../../actions/forums/ForumTopicAction';

type Action = ForumAction | NewsAction;

type ItemMap = { [id: number]: IForumThread };
function byId(state: ItemMap = {}, action: Action): ItemMap {
    switch (action.type) {
        case 'RECEIVED_FORUM_GROUPS':
        case 'RECEIVED_FORUM_TOPIC':
        case 'RECEIVED_FORUM_THREAD':
        case 'RECEIVED_NEWS_POST':
            let map: ItemMap = {};
            for (const item of action.data.threads) {
                map[item.id] = item;
            }
            return objectAssign({}, state, map);
        default:
            return state;
    }
}

type Items = INestedPages<IForumThread>;
function byTopic(state: Items = {}, action: ForumTopicAction): Items {
    switch (action.type) {
        case 'FAILED_FORUM_TOPIC':
        case 'FETCHING_FORUM_TOPIC':
        case 'INVALIDATE_FORUM_TOPIC':
            return processThreads({ state , action });
        case 'RECEIVED_FORUM_TOPIC':
            return processThreads({ state, action, count: action.count });
        default:
            return state;
    }
}

interface IThreadProcessingParams {
    state: Items;
    action: ForumTopicAction;
    count?: number;
}

const pageReducer = getPageReducer<IForumThread>('FORUM_TOPIC', (action: ForumTopicReceivedAction) => {
    return action.data.threads || [];
});

function processThreads(params: IThreadProcessingParams) {
    const action = params.action;
    const count = params.count || 0;
    const current = params.state[action.id] || { count, pages: {} };
    const currentPage = current.pages[action.page];
    const itemSet = objectAssign({}, current.pages, {
        [action.page]: pageReducer(currentPage, params.action)
    });
    return objectAssign({}, params.state, {
        [action.id]: {
            count: count,
            pages: itemSet
        }
    });
}

export default combineReducers<ForumThreadData>({ byId, byTopic });
