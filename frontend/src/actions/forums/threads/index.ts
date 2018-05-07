import ForumThreadAction from './ForumThreadAction';
import CreateThreadAction from './CreateThreadAction';
import DeleteThreadAction from './DeleteThreadAction';

type Action = ForumThreadAction | CreateThreadAction | DeleteThreadAction;
export default Action;