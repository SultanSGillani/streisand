import AuthAction from './AuthAction';
import LogoutAction from './LogoutAction';
import ChangePasswordAction from './ChangePasswordAction';

type Action = AuthAction | ChangePasswordAction | LogoutAction;
export default Action;