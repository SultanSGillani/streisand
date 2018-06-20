import { put } from 'redux-saga/effects';
import { push } from 'react-router-redux';

import globals from '../../utilities/globals';
import { transformInvite } from './transforms';
import { post } from '../../utilities/Requestor';
import IInvite, { IInviteResponse } from '../../models/IInvite';
import { generateAuthFetch, generateSage } from '../sagas/generators';

export interface IActionProps {
    email: string;
}

export type RequestNewInvite = { type: 'REQUEST_NEW_INVITE', props: IActionProps };
export type ReceivedNewInvite = { type: 'RECEIVED_NEW_INVITE', invite: IInvite };
export type FailedNewInvite = { type: 'FAILED_NEW_INVITE', props: IActionProps };

type CreateInviteAction = RequestNewInvite | ReceivedNewInvite | FailedNewInvite;
export default CreateInviteAction;
type Action = CreateInviteAction;

function* received(response: IInviteResponse, props: IActionProps) {
    yield put<Action>({
        type: 'RECEIVED_NEW_INVITE',
        invite: transformInvite(response)
    });
    yield put(push(`/invites/1`));
}

function failure(props: IActionProps): Action {
    return { type: 'FAILED_NEW_INVITE', props };
}

export function sendInvite(props: IActionProps): Action {
    return { type: 'REQUEST_NEW_INVITE', props };
}

const errorPrefix = 'Creating new user invite failed';
const fetch = generateAuthFetch({ errorPrefix, request, received, failure });
export const createInviteSaga = generateSage<RequestNewInvite>('REQUEST_NEW_INVITE', fetch);

function request(token: string, data: IActionProps): Promise<IInviteResponse> {
    return post({ token, data, url: `${globals.apiUrl}/invites/` });
}