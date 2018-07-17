
import { transformThreads } from './transforms';
import globals from '../../../../utilities/globals';
import { get } from '../../../../utilities/Requestor';
import IPagedResponse from '../../../../models/base/IPagedResponse';
import { generateAuthFetch, generateSage } from '../../../sagas/generators';
import { IForumThread, IForumThreadResponse } from '../../../../models/forums/IForumThread';

export interface IThreadSearchProps {
    page: number;
    title: string;
    advanced?: boolean;
}

interface IActionProps extends IThreadSearchProps { }

export type RequestThreadSearch = { type: 'REQUEST_THREAD_SEARCH', props: IActionProps };
export type ReceivedThreadSearch = { type: 'RECEIVED_THREAD_SEARCH', props: { page: number, pageSize: number, count: number, items: IForumThread[] } };
export type FailedThreadSearch = { type: 'FAILED_THREAD_SEARCH', props: IActionProps };

type ThreadSearchAction = RequestThreadSearch | ReceivedThreadSearch | FailedThreadSearch;
export default ThreadSearchAction;
type Action = ThreadSearchAction;

function received(response: IPagedResponse<IForumThreadResponse>, props: IActionProps): Action {
    const pageSize = props.advanced ? globals.pageSize.threads : globals.pageSize.simpleSearch;
    const data = transformThreads(response.results);
    return {
        type: 'RECEIVED_THREAD_SEARCH',
        props: {
            page: props.page,
            pageSize: pageSize,
            count: response.count,
            items: data.threads
        }
    };
}

function failure(props: IActionProps): Action {
    return { type: 'FAILED_THREAD_SEARCH', props };
}

export function searchThread(props: IThreadSearchProps): Action {
    return { type: 'REQUEST_THREAD_SEARCH', props };
}

const errorPrefix = (props: IActionProps) => `Fetching page ${props.page} of forum thread search failed`;
const fetch = generateAuthFetch({ errorPrefix, request, received, failure });
export const threadSearchSaga = generateSage<RequestThreadSearch>('REQUEST_THREAD_SEARCH', fetch);

function request(token: string, props: IActionProps): Promise<IPagedResponse<IForumThreadResponse>> {
    const search = `&title=${props.title || ''}`;
    const pageSize = props.advanced ? globals.pageSize.threads : globals.pageSize.simpleSearch;
    return get({ token, url: `${globals.apiUrl}/forum-thread-index/?page=${props.page}&size=${pageSize}&omit=posts${search}` });
}