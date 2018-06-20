
import globals from '../../utilities/globals';
import { transformInvite } from './transforms';
import { get } from '../../utilities/Requestor';
import IPagedResponse from '../../models/base/IPagedResponse';
import IInvite, { IInviteResponse } from '../../models/IInvite';
import { generateAuthFetch, generateSage } from '../sagas/generators';

interface IActionProps { page: number; }
const PAGE_SIZE = globals.pageSize.invites;

export type RequestInvites = { type: 'REQUEST_INVITES', props: IActionProps };
export type ReceivedInvites = {
    type: 'RECEIVED_INVITES',
    props: { page: number, pageSize: number, count: number, items: IInvite[] }
};
export type FailedInvites = { type: 'FAILED_INVITES', props: IActionProps };
export type InvalidateInvites = { type: 'INVALIDATE_INVITES', props: IActionProps };

type InvitesAction = RequestInvites | ReceivedInvites | FailedInvites | InvalidateInvites;
export default InvitesAction;
type Action = InvitesAction;

function received(response: IPagedResponse<IInviteResponse>, props: IActionProps): Action {
    return {
        type: 'RECEIVED_INVITES',
        props: {
            page: props.page,
            pageSize: PAGE_SIZE,
            count: response.count,
            items: response.results.map(transformInvite)
        }
    };
}

function failure(props: IActionProps): Action {
    return { type: 'FAILED_INVITES', props };
}

export function invalidate(props: IActionProps): Action {
    return { type: 'INVALIDATE_INVITES', props };
}

export function getInvites(page: number = 1): Action {
    return { type: 'REQUEST_INVITES', props: { page } };
}

const errorPrefix = (props: IActionProps) => `Fetching page ${props.page} of invites failed`;
const fetch = generateAuthFetch({ errorPrefix, request, received, failure });
export const invitesSaga = generateSage<RequestInvites>('REQUEST_INVITES', fetch);

function request(token: string, props: IActionProps): Promise<IPagedResponse<IInviteResponse>> {
    return get({ token, url: `${globals.apiUrl}/invites/?page=${props.page}&size=${PAGE_SIZE}` });
}