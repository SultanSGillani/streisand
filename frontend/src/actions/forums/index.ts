import ForumTopicAction from './ForumTopicAction';
import ForumGroupsAction from './ForumGroupsAction';
import ForumThreadAction from './ForumThreadAction';

type Action = ForumGroupsAction | ForumTopicAction | ForumThreadAction;
export default Action;