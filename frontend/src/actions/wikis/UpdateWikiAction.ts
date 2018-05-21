
import globals from '../../utilities/globals';
import { put } from '../../utilities/Requestor';
import IWiki, { IWikiUpdate } from '../../models/IWiki';
import { generateAuthFetch, generateSage } from '../sagas/generators';

interface IActionProps extends IWikiUpdate { id: number; }

export type RequestWikiUpdate = { type: 'REQUEST_WIKI_UPDATE', props: IActionProps };
export type ReceivedtWikiUpdate = { type: 'RECEIVED_WIKI_UPDATE', wiki: IWiki };
export type FailedWikiUpdate = { type: 'FAILED_WIKI_UPDATE', props: IActionProps };

type WikiUpdateAction = RequestWikiUpdate | ReceivedtWikiUpdate | FailedWikiUpdate;
export default WikiUpdateAction;
type Action = WikiUpdateAction;

function received(wiki: IWiki): Action {
    return { type: 'RECEIVED_WIKI_UPDATE', wiki };
}

function failure(props: IActionProps): Action {
    return { type: 'FAILED_WIKI_UPDATE', props };
}

export function updateWiki(id: number, wiki: IWikiUpdate): Action {
    return { type: 'REQUEST_WIKI_UPDATE', props: { id, ...wiki } };
}

const errorPrefix = (props: IActionProps) => `Updating a wiki (${props.id}) failed`;
const fetch = generateAuthFetch({ errorPrefix, request, received, failure });
export const updateWikiSaga = generateSage<RequestWikiUpdate>('REQUEST_WIKI_UPDATE', fetch);

function request(token: string, props: IActionProps): Promise<IWiki> {
    const { id, ...data } = props;
    return put({ token, data, url: `${globals.apiUrl}/wikis/${id}/` });
}