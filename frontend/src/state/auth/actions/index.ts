
import LogoutAction from './LogoutAction';
import RegisterAction from './RegisterAction';
import AuthenticateAction from './AuthenticateAction';
import ChangePasswordAction from './ChangePasswordAction';

type Action = AuthenticateAction | ChangePasswordAction | LogoutAction | RegisterAction;
export default Action;