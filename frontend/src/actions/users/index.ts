import UserAction from './UserAction';
import BulkUserAction from './BulkUserAction';
import CurrentUserAction from './CurrentUserAction';

type Action = UserAction | CurrentUserAction | BulkUserAction;
export default Action;