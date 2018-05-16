import * as objectAssign from 'object-assign';

import { combineReducers } from '../helpers';
import ForumAction from '../../actions/forums';
import NewsAction from '../../actions/NewsAction';
import { getPageReducer } from '../utilities/page';
import { IForumThread } from '../../models/forums/IForumThread';
import { ForumThreadData } from '../../models/forums/IForumData';
import { INestedPages, IPage, INestedPage } from '../../models/base/IPagedItemSet';
import ForumTopicAction, { ForumTopicReceivedAction } from '../../actions/forums/topics/ForumTopicAction';

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

type Items = INestedPages;
function byTopic(state: Items = {}, action: ForumTopicAction): Items {
    switch (action.type) {
        case 'FAILED_FORUM_TOPIC':
        case 'FETCHING_FORUM_TOPIC':
        case 'INVALIDATE_FORUM_TOPIC':
            return processThreads({ state , action });
        case 'RECEIVED_FORUM_TOPIC':
            return processThreads({ state, action, count: action.count, pageSize: action.pageSize });
        default:
            return state;
    }
}

interface IThreadProcessingParams {
    state: Items;
    action: ForumTopicAction;
    count?: number;
    pageSize?: number;
}

const pageReducer = getPageReducer('FORUM_TOPIC', (action: ForumTopicReceivedAction) => {
    return action.data.threads || [];
});

type Pages = { [page: number]: IPage };
function processThreads(params: IThreadProcessingParams): INestedPages {
    const { action, count, pageSize } = params;
    const current = params.state[action.id] || { count, pageSize, pages: {} };
    const currentPage = current.pages[action.page];
    const itemSet: Pages = objectAssign({}, current.pages, {
        [action.page]: pageReducer(currentPage, params.action)
    });
    const nestedPage: INestedPage = {
        pages: itemSet,
        count: count !== undefined ? count : current.count,
        pageSize: pageSize !== undefined ? pageSize : current.pageSize
    };
    return objectAssign({}, params.state, {
        [action.id]: nestedPage
    });
}

export default combineReducers<ForumThreadData>({ byId, byTopic });