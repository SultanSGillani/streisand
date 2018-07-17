import * as objectAssign from 'object-assign';

import ForumAction from '../actions';
import NewsAction from '../../news/actions';
import { IForumThreadStore } from './store';
import { getPageReducer } from '../../reducers/page';
import { getPagesReducer } from '../../reducers/pages';
import { combineReducers } from '../../reducers/helpers';
import { IForumThread } from '../../../models/forums/IForumThread';
import { INestedPages, IItemPage, IItemPages } from '../../../models/base/IPagedItemSet';
import ForumTopicAction, { ReceivedForumTopic } from '../topic/actions/ForumTopicAction';

type Action = ForumAction | NewsAction;

type ItemMap = { [id: number]: IForumThread };
function byId(state: ItemMap = {}, action: Action): ItemMap {
    switch (action.type) {
        case 'RECEIVED_FORUM_GROUPS':
        case 'RECEIVED_FORUM_TOPIC':
        case 'RECEIVED_FORUM_THREAD':
        case 'RECEIVED_NEWS_POST':
            let map: ItemMap = {};
            for (const item of action.props.data.threads) {
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
        case 'REQUEST_FORUM_TOPIC':
        case 'INVALIDATE_FORUM_TOPIC':
            return processThreads({ state , action });
        case 'RECEIVED_FORUM_TOPIC':
            return processThreads({ state, action, count: action.props.count, pageSize: action.props.pageSize });
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

const pageReducer = getPageReducer('FORUM_TOPIC', (action: ReceivedForumTopic) => {
    return action.props.data.threads || [];
});

type Pages = { [page: number]: IItemPage };
function processThreads(params: IThreadProcessingParams): INestedPages {
    const { action, count, pageSize } = params;
    const current = params.state[action.props.id] || { count, pageSize, pages: {} };
    const currentPage = current.pages[action.props.page];
    const itemSet: Pages = objectAssign({}, current.pages, {
        [action.props.page]: pageReducer(currentPage, params.action)
    });
    const nestedPage: IItemPages = {
        pages: itemSet,
        count: count !== undefined ? count : current.count,
        pageSize: pageSize !== undefined ? pageSize : current.pageSize
    };
    return objectAssign({}, params.state, {
        [action.props.id]: nestedPage
    });
}

const search = getPagesReducer('THREAD_SEARCH');
export default combineReducers<IForumThreadStore>({ byId, byTopic, search });