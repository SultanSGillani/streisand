import Store from '../store';
import ErrorAction from './ErrorAction';
import globals from '../utilities/globals';
import { get } from '../utilities/Requestor';
import { simplefetchData } from './ActionHelper';
import { ThunkAction, IDispatch } from './ActionTypes';
import { transformNewsPost } from './forums/transforms';
import BulkUserAction, { getUsers } from './users/BulkUserAction';
import { INewsPostResponse, INewsPostData } from '../models/forums/INewsPost';

type NewsAction =
    { type: 'FETCHING_NEWS_POST' } |
    { type: 'RECEIVED_NEWS_POST', data: INewsPostData } |
    { type: 'FAILED_NEWS_POST' };
export default NewsAction;
type Action = NewsAction | BulkUserAction | ErrorAction;

function fetching(): Action {
    return { type: 'FETCHING_NEWS_POST' };
}

function received(news: INewsPostResponse): ThunkAction<Action> {
    return (dispatch: IDispatch<Action>, getState: () => Store.All) => {
        const data = transformNewsPost(news);
        if (data.users.length) {
            dispatch(getUsers(data.users));
        }
        return dispatch({ type: 'RECEIVED_NEWS_POST', data });
    };
}

function failure(): Action {
    return { type: 'FAILED_NEWS_POST' };
}

export function getLatestNews(): ThunkAction<Action> {
    const errorPrefix = 'Fetching latest news failed';
    return simplefetchData({ request, fetching, received, failure, errorPrefix });
}

function request(token: string): Promise<INewsPostResponse> {
    return get({ token, url: `${globals.apiUrl}/news-posts/latest/` });
}