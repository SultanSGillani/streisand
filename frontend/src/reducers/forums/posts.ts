import * as objectAssign from 'object-assign';

import { combineReducers } from '../helpers';
import ForumAction from '../../actions/forums';
import NewsAction from '../../actions/NewsAction';
import { getPageReducer } from '../utilities/page';
import { IForumPost } from '../../models/forums/IForumPost';
import { ForumPostData } from '../../models/forums/IForumData';
import { INestedPages, INestedPage, IPage } from '../../models/base/IPagedItemSet';
import ForumThreadAction, { ReceivedThread } from '../../actions/forums/threads/ForumThreadAction';

type Action = ForumAction | NewsAction;

type ItemMap = { [id: number]: IForumPost };
function byId(state: ItemMap = {}, action: Action): ItemMap {
    switch (action.type) {
        case 'RECEIVED_FORUM_POST_UPDATE':
        return objectAssign({}, state, {[action.post.id]: action.post});
        case 'RECEIVED_FORUM_GROUPS':
        case 'RECEIVED_FORUM_TOPIC':
        case 'RECEIVED_FORUM_THREAD':
        case 'RECEIVED_NEWS_POST':
            let map: ItemMap = {};
            for (const item of action.props.data.posts) {
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
        case 'REQUEST_FORUM_THREAD':
        case 'INVALIDATE_FORUM_THREAD':
            return processPosts({ state, action });
        case 'RECEIVED_FORUM_THREAD':
            return processPosts({ state, action, count: action.props.count, pageSize: action.props.pageSize });
        default:
            return state;
    }
}

interface IPostProcessingParams {
    state: Items;
    action: ForumThreadAction;
    count?: number;
    pageSize?: number;
}

const pageReducer = getPageReducer('FORUM_THREAD', (action: ReceivedThread) => {
    return action.props.data.posts || [];
});

type Pages = { [page: number]: IPage };
function processPosts(params: IPostProcessingParams) {
    const { action, count, pageSize } = params;
    const current = params.state[action.props.id] || { count, pageSize, pages: {} };
    const currentPage = current.pages[action.props.page];
    const itemSet: Pages = objectAssign({}, current.pages, {
        [action.props.page]: pageReducer(currentPage, params.action)
    });
    const nestedPage: INestedPage = {
        pages: itemSet,
        count: count !== undefined ? count : current.count,
        pageSize: pageSize !== undefined ? pageSize : current.pageSize
    };
    return objectAssign({}, params.state, {
        [action.props.id]: nestedPage
    });
}

export default combineReducers<ForumPostData>({ byId, byThread });