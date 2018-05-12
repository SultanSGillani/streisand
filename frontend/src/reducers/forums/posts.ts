import * as objectAssign from 'object-assign';

import { combineReducers } from '../helpers';
import ForumAction from '../../actions/forums';
import NewsAction from '../../actions/NewsAction';
import { getPageReducer } from '../utilities/page';
import { IForumPost } from '../../models/forums/IForumPost';
import { INestedPages } from '../../models/base/IPagedItemSet';
import { ForumPostData } from '../../models/forums/IForumData';
import ForumThreadAction, { ForumThreadReceivedAction } from '../../actions/forums/threads/ForumThreadAction';

type Action = ForumAction | NewsAction;

type ItemMap = { [id: number]: IForumPost };
function byId(state: ItemMap = {}, action: Action): ItemMap {
    switch (action.type) {
        case 'RECEIVED_FORUM_GROUPS':
        case 'RECEIVED_FORUM_TOPIC':
        case 'RECEIVED_FORUM_THREAD':
        case 'RECEIVED_NEWS_POST':
            let map: ItemMap = {};
            for (const item of action.data.posts) {
                map[item.id] = item;
            }
            return objectAssign({}, state, map);
        default:
            return state;
    }
}

type Items = INestedPages;
function byThread(state: Items = {}, action: ForumThreadAction): Items {
    switch (action.type) {
        case 'FAILED_FORUM_THREAD':
        case 'FETCHING_FORUM_THREAD':
        case 'INVALIDATE_FORUM_THREAD':
            return processPosts({ state, action });
        case 'RECEIVED_FORUM_THREAD':
            return processPosts({ state, action, count: action.count });
        default:
            return state;
    }
}

interface IPostProcessingParams {
    state: Items;
    action: ForumThreadAction;
    count?: number;
}

const pageReducer = getPageReducer('FORUM_THREAD', (action: ForumThreadReceivedAction) => {
    return action.data.posts || [];
});

function processPosts(params: IPostProcessingParams) {
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

export default combineReducers<ForumPostData>({ byId, byThread });