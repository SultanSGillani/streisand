import ForumGroupsAction from './ForumGroupsAction';
import ForumTopicAction from './topics';
import ForumThreadAction from './threads';
import ForumPostAction from './posts';

type Action = ForumGroupsAction | ForumTopicAction | ForumThreadAction | ForumPostAction;
export default Action;