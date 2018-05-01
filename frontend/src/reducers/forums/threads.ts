import * as objectAssign from 'object-assign';

import { combineReducers } from '../helpers';
import ForumAction from '../../actions/forums';
import NewsAction from '../../actions/NewsAction';
import ILoadingItem from '../../models/base/ILoadingItem';
import { INestedPages } from '../../models/base/IPagedItemSet';
import { IForumThread } from '../../models/forums/IForumThread';
import { ForumThreadData } from '../../models/forums/IForumData';

type Action = ForumAction | NewsAction;

type ItemMap = { [id: number]: IForumThread | ILoadingItem };
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
function byTopic(state: Items = {}, action: Action): Items {
    switch (action.type) {
        case 'FORUM_TOPIC_FAILURE':
            return processThreads({
                state: state,
                topicId: action.id,
                loading: false,
                pageNumber: action.page
            });
        case 'FETCHING_FORUM_TOPIC':
            return processThreads({
                state: state,
                topicId: action.id,
                loading: true,
                pageNumber: action.page
            });
        case 'RECEIVED_FORUM_TOPIC':
            return processThreads({
                state: state,
                topicId: action.id,
                loading: false,
                pageNumber: action.page,
                count: action.count,
                threads: action.data.threads
            });
        default:
            return state;
    }
}

interface IThreadProcessingParams {
    state: Items;
    topicId: number;
    loading: boolean;
    pageNumber: number;
    count?: number;
    threads?: IForumThread[];
}

function processThreads(params: IThreadProcessingParams) {
    const count = params.count || 0;
    const current = params.state[params.topicId] || { count, pages: {} };
    const itemSet = objectAssign({}, current.pages, {
        [params.pageNumber]: {
            loading: params.loading,
            items: params.threads || []
        }
    });
    return objectAssign({}, params.state, {
        [params.topicId]: {
            count: count,
            pages: itemSet
        }
    });
}

export default combineReducers<ForumThreadData>({ byId, byTopic });