
import { transformUser } from './transforms';
import globals from '../../../utilities/globals';
import { get } from '../../../utilities/Requestor';
import IUser, { IUserResponse } from '../../../models/IUser';
import { generateSage, generateAuthFetch } from '../../sagas/generators';

interface IActionProps { id: number; }

export type RequestUser = { type: 'REQUEST_USER', props: IActionProps };
export type ReceivedUser = { type: 'RECEIVED_USER', user: IUser };
export type FailedUser = { type: 'FAILED_USER', props: IActionProps };

type UserAction = RequestUser | ReceivedUser | FailedUser;
export default UserAction;
type Action = UserAction;

function received(response: IUserResponse): Action {
    return {
        type: 'RECEIVED_USER',
        user: transformUser(response)
    };
}

function failure(props: IActionProps): Action {
    return { type: 'FAILED_USER', props };
}

export function getUser(id: number): Action {
    return { type: 'REQUEST_USER', props: { id } };
}

const errorPrefix = (props: IActionProps) => `Fetching user (${props.id}) failed`;
const fetch = generateAuthFetch({ errorPrefix, request, received, failure });
export const userSaga = generateSage<RequestUser>('REQUEST_USER', fetch);

function request(token: string, props: IActionProps): Promise<IUserResponse> {
    return get({ token, url: `${globals.apiUrl}/users/${props.id}/` });
}