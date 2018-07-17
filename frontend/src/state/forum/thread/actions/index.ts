
import ForumThreadAction from './ForumThreadAction';
import CreateThreadAction from './CreateThreadAction';
import DeleteThreadAction from './DeleteThreadAction';
import ThreadSearchAction from './ThreadSearchAction';

type Action = ForumThreadAction | CreateThreadAction | DeleteThreadAction | ThreadSearchAction;
export default Action;