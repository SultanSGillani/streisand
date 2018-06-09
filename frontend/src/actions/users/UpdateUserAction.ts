
import { transformUser } from './transforms';
import globals from '../../utilities/globals';
import { patch } from '../../utilities/Requestor';
import { generateAuthFetch, generateSage } from '../sagas/generators';
import IUser, { IUserUpdate, IUserResponse } from '../../models/IUser';

interface IActionProps extends IUserUpdate { id: number; }

export type RequestUserUpdate = { type: 'REQUEST_USER_UPDATE', props: IActionProps };
export type ReceivedUserUpdate = { type: 'RECEIVED_USER_UPDATE', user: IUser };
export type FailedUserUpdate = { type: 'FAILED_USER_UPDATE', props: IActionProps };

type UserUpdateAction = RequestUserUpdate | ReceivedUserUpdate | FailedUserUpdate;
export default UserUpdateAction;
type Action = UserUpdateAction;

function received(user: IUserResponse): Action {
    return {
        type: 'RECEIVED_USER_UPDATE',
        user: transformUser(user)
    };
}

function failure(props: IActionProps): Action {
    return { type: 'FAILED_USER_UPDATE', props };
}

export function updateUser(id: number, update: IUserUpdate): Action {
    return { type: 'REQUEST_USER_UPDATE', props: { id, ...update } };
}

const errorPrefix = (props: IActionProps) => `Updating user information (${props.id}) failed`;
const fetch = generateAuthFetch({ errorPrefix, request, received, failure });
export const updateUserSaga = generateSage<RequestUserUpdate>('REQUEST_USER_UPDATE', fetch);

function request(token: string, props: IActionProps): Promise<IUserResponse> {
    const { id, ...data } = props;
    return patch({ token, data, url: `${globals.apiUrl}/users/${id}/` });
}