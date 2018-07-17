
import UserAction from './UserAction';
import BulkUserAction from './BulkUserAction';
import UserUpdateAction from './UpdateUserAction';
import CurrentUserAction from './CurrentUserAction';

type Action = UserAction | CurrentUserAction | BulkUserAction | UserUpdateAction;
export default Action;