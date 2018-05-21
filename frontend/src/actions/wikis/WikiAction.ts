
import IWiki from '../../models/IWiki';
import globals from '../../utilities/globals';
import { get } from '../../utilities/Requestor';
import { generateAuthFetch, generateSage } from '../sagas/generators';

interface IActionProps { id: number; }

export type RequestWiki = { type: 'REQUEST_WIKI', props: IActionProps };
export type ReceivedtWiki = { type: 'RECEIVED_WIKI', wiki: IWiki };
export type FailedWiki = { type: 'FAILED_WIKI', props: IActionProps };

type WikiAction = RequestWiki | ReceivedtWiki | FailedWiki;
export default WikiAction;
type Action = WikiAction;

export function received(wiki: IWiki): Action {
    return { type: 'RECEIVED_WIKI', wiki };
}

function failure(props: IActionProps): Action {
    return { type: 'FAILED_WIKI', props };
}

export function getWiki(id: number): Action {
    return { type: 'REQUEST_WIKI', props: { id } };
}

const errorPrefix = (props: IActionProps) => `Fetching wiki (${props.id}) failed`;
const fetch = generateAuthFetch({ errorPrefix, request, received, failure });
export const wikiSaga = generateSage<RequestWiki>('REQUEST_WIKI', fetch);

function request(token: string, props: IActionProps): Promise<IWiki> {
    return get({ token, url: `${globals.apiUrl}/wikis/${props.id}/` });
}