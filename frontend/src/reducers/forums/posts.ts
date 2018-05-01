import * as objectAssign from 'object-assign';

import { combineReducers } from '../helpers';
import ForumAction from '../../actions/forums';
import NewsAction from '../../actions/NewsAction';
import { IForumPost } from '../../models/forums/IForumPost';
import { INestedPages } from '../../models/base/IPagedItemSet';
import { ForumPostData } from '../../models/forums/IForumData';

type Action = ForumAction | NewsAction;

type ItemMap = { [id: number]: IForumPost };
function byId(state: ItemMap = {}, action: Action): ItemMap {
    switch (action.type) {
        case 'RECEIVED_FORUM_GROUPS':
        case 'RECEIVED_FORUM_TOPIC':
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

type Items = INestedPages<IForumPost>;
function byThread(state: Items = {}, action: Action): Items {
    switch (action.type) {
        case 'FORUM_THREAD_FAILURE':
            return processPosts({
                state: state,
                threadId: action.id,
                loading: false,
                pageNumber: action.page
            });
        case 'FETCHING_FORUM_THREAD':
            return processPosts({
                state: state,
                threadId: action.id,
                loading: true,
                pageNumber: action.page
            });
        case 'RECEIVED_FORUM_THREAD':
        return processPosts({
            state: state,
            threadId: action.id,
            loading: false,
            pageNumber: action.page,
            count: action.count,
            posts: action.data.posts
        });
        default:
            return state;
    }
}

interface IPostProcessingParams {
    state: Items;
    threadId: number;
    loading: boolean;
    pageNumber: number;
    count?: number;
    posts?: IForumPost[];
}

function processPosts(params: IPostProcessingParams) {
    const count = params.count || 0;
    const current = params.state[params.threadId] || { count, pages: {} };
    const itemSet = objectAssign({}, current.pages, {
        [params.pageNumber]: {
            loading: params.loading,
            items: params.posts || []
        }
    });
    return objectAssign({}, params.state, {
        [params.threadId]: {
            count: count,
            pages: itemSet
        }
    });
}

export default combineReducers<ForumPostData>({ byId, byThread });