import { put } from 'redux-saga/effects';

import globals from '../../../utilities/globals';
import { transformNewsPost } from './transforms';
import { get } from '../../../utilities/Requestor';
import { getUsers } from '../../user/actions/BulkUserAction';
import { generateAuthFetch, generateSage } from '../../sagas/generators';
import { INewsPostResponse, INewsPostData } from '../../../models/forums/INewsPost';

export type RequestNews = { type: 'REQUEST_NEWS_POST' };
export type ReceivedNews = { type: 'RECEIVED_NEWS_POST', props: { data: INewsPostData }};
export type FailedNews = { type: 'FAILED_NEWS_POST' };

type NewsAction = RequestNews | ReceivedNews | FailedNews;
export default NewsAction;
type Action = NewsAction;

function* received(news: INewsPostResponse) {
    const data = transformNewsPost(news);
    yield put<Action>({ type: 'RECEIVED_NEWS_POST', props: { data } });
    if (data.users.length) {
        yield put(getUsers(data.users));
    }
}

function failure(): Action {
    return { type: 'FAILED_NEWS_POST' };
}

export function getLatestNews(): Action {
    return { type: 'REQUEST_NEWS_POST' };
}

const errorPrefix = 'Fetching latest news failed';
const fetch = generateAuthFetch({ errorPrefix, request, received, failure });
export const newsSaga = generateSage<RequestNews>('REQUEST_NEWS_POST', fetch);

function request(token: string): Promise<INewsPostResponse> {
    return get({ token, url: `${globals.apiUrl}/news-posts/latest/` });
}