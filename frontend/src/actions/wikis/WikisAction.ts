import { ThunkAction } from '../ActionTypes';
import globals from '../../utilities/globals';
import { get } from '../../utilities/Requestor';

import IWiki from '../../models/IWiki';
import ErrorAction from '../ErrorAction';
import { fetchData } from '../ActionHelper';
import IPagedResponse from '../../models/base/IPagedResponse';

type WikisAction =
    { type: 'FETCHING_WIKIS', page: number } |
    { type: 'RECEIVED_WIKIS', page: number, count: number, wikis: IWiki[] } |
    { type: 'WIKIS_FAILURE', page: number };
export default WikisAction;
type Action = WikisAction | ErrorAction;

function fetching(page: number): Action {
    return { type: 'FETCHING_WIKIS', page };
}

function received(page: number, response: IPagedResponse<IWiki>): Action {
    return {
        page: page,
        count: response.count,
        type: 'RECEIVED_WIKIS',
        wikis: response.results
    };
}

function failure(page: number): Action {
    return { type: 'WIKIS_FAILURE', page };
}

export function getWikis(page: number = 1): ThunkAction<Action> {
    const errorPrefix = `Fetching page ${page} of wikis failed`;
    return fetchData({ request, fetching, received, failure, errorPrefix, props: page });
}

function request(token: string, page: number): Promise<IPagedResponse<IWiki>> {
    return get({ token, url: `${globals.apiUrl}/wiki-articles/?page=${page}` });
}