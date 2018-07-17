
import globals from '../../../utilities/globals';
import { post } from '../../../utilities/Requestor';
import { generateSage, generateAuthFetch } from '../../sagas/generators';
import LoggedOutAction, { loggedOut, ReceivedLogout } from './LoggedOutAction';

export type RequestLogout = { type: 'REQUEST_LOGOUT' };
export { ReceivedLogout };
export type FailedLogout = { type: 'FAILED_LOGOUT' };

type LogoutAction = RequestLogout | LoggedOutAction | FailedLogout;
export default LogoutAction;
type Action = LogoutAction;

const received = loggedOut;

function failure(): Action {
    return { type: 'FAILED_LOGOUT' };
}

export function logout(): Action {
    return { type: 'REQUEST_LOGOUT' };
}

const errorPrefix = 'User logout failed';
const fetch = generateAuthFetch({ errorPrefix, request, received, failure });
export const logoutSaga = generateSage<RequestLogout>('REQUEST_LOGOUT', fetch);

function request(token: string): Promise<void> {
    return post({ token, url: `${globals.apiUrl}/knox/logout/` });
}
