
import IWiki from '../../models/IWiki';
import globals from '../../utilities/globals';
import { get } from '../../utilities/Requestor';
import IPagedResponse from '../../models/base/IPagedResponse';
import { generateAuthFetch, generateSage } from '../sagas/generators';

interface IActionProps { page: number; }
const PAGE_SIZE = globals.pageSize.wikis;

export type RequestWikis = { type: 'REQUEST_WIKIS', props: IActionProps };
export type ReceivedWikis = { type: 'RECEIVED_WIKIS', props: { page: number, pageSize: number, count: number, items: IWiki[] } };
export type FailedWikis = { type: 'FAILED_WIKIS', props: IActionProps };
export type InvalidateWikis = { type: 'INVALIDATE_WIKIS', props: IActionProps };
type WikisAction = RequestWikis | ReceivedWikis | FailedWikis | InvalidateWikis;
export default WikisAction;
type Action = WikisAction;

function received(response: IPagedResponse<IWiki>, props: IActionProps): Action {
    return {
        type: 'RECEIVED_WIKIS',
        props: {
            page: props.page,
            pageSize: PAGE_SIZE,
            count: response.count,
            items: response.results
        }
    };
}

function failure(props: IActionProps): Action {
    return { type: 'FAILED_WIKIS', props };
}

export function invalidate(props: IActionProps): Action {
    return { type: 'INVALIDATE_WIKIS', props };
}

export function getWikis(page: number = 1): Action {
    return { type: 'REQUEST_WIKIS', props: { page } };
}

const errorPrefix = (props: IActionProps) => `Featching page ${props.page} of wikis failed`;
const fetch = generateAuthFetch({ errorPrefix, request, received, failure });
export const wikisSaga = generateSage<RequestWikis>('REQUEST_WIKIS', fetch);

function request(token: string, props: IActionProps): Promise<IPagedResponse<IWiki>> {
    return get({ token, url: `${globals.apiUrl}/wiki-articles/?page=${props.page}&size=${PAGE_SIZE}` });
}