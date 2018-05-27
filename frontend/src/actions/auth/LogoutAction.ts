
import { storeAuthToken } from '../../utilities/storage';

type LogoutAction = { type: 'LOGOUT' };
export default LogoutAction;
type Action = LogoutAction;

export function logout(): Action {
    storeAuthToken('');
    return { type: 'LOGOUT' };
}