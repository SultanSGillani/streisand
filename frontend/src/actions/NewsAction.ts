import globals from '../utilities/globals';
import { ThunkAction } from './ActionTypes';
import { get } from '../utilities/Requestor';

import ErrorAction from './ErrorAction';
import { simplefetchData } from './ActionHelper';
import { transformPost } from './forums/transforms';
import { IForumGroupData } from '../models/forums/IForumGroup';
import { IForumPostResponse } from '../models/forums/IForumPost';

type NewsAction =
    { type: 'FETCHING_NEWS_POST' } |
    { type: 'RECEIVED_NEWS_POST', data: IForumGroupData } |
    { type: 'NEWS_POST_FAILURE' };
export default NewsAction;
type Action = NewsAction | ErrorAction;

function fetching(): Action {
    return { type: 'FETCHING_NEWS_POST' };
}

function received(post: IForumPostResponse): Action {
    return { type: 'RECEIVED_NEWS_POST', data: transformPost(post) };
}

function failure(): Action {
    return { type: 'NEWS_POST_FAILURE' };
}

export function getLatestNews(): ThunkAction<Action> {
    const errorPrefix = 'Fetching latest news failed';
    return simplefetchData({ request, fetching, received, failure, errorPrefix });
}

function request(token: string): Promise<IForumPostResponse> {
    return get({ token, url: `${globals.apiUrl}/news-posts/latest/` });
}