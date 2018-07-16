import { push } from 'react-router-redux';
import { put } from 'redux-saga/effects';

import { invalidate } from './InvitesAction';
import globals from '../../../utilities/globals';
import { remove } from '../../../utilities/Requestor';
import { generateSage, generateAuthFetch } from '../../sagas/generators';

export interface IActionProps {
    id: string;
    currentPage?: number;
}

export type RequestInviteDeletion = { type: 'REQUEST_INVITE_DELETION', props: IActionProps };
export type ReceivedInviteDeletion = { type: 'RECEIVED_INVITE_DELETION', props: IActionProps };
export type FailedInviteDeletion = { type: 'FAILED_INVITE_DELETION', props: IActionProps };

type DeleteInviteAction = RequestInviteDeletion | ReceivedInviteDeletion | FailedInviteDeletion;
export default DeleteInviteAction;
type Action = DeleteInviteAction;

function* received(response: void, props: IActionProps) {
    yield put<Action>({ type: 'RECEIVED_INVITE_DELETION', props });
    if (props.currentPage) {
        yield put(invalidate({ page: props.currentPage }));
    } else {
        yield put(push('/invites/1'));
    }
}

function failure(props: IActionProps): Action {
    return { type: 'FAILED_INVITE_DELETION', props };
}

export function deleteInvite(props: IActionProps): Action {
    return { type: 'REQUEST_INVITE_DELETION', props };
}

const errorPrefix = (props: IActionProps) => `Deleting an invite (${props.id}) failed`;
const fetch = generateAuthFetch({ errorPrefix, request, received, failure });
export const deleteInviteSaga = generateSage<RequestInviteDeletion>('REQUEST_INVITE_DELETION', fetch);

function request(token: string, props: IActionProps): Promise<void> {
    return remove({ token, url: `${globals.apiUrl}/invites/${props.id}/` });
}