
import ForumPostAction from './post/actions';
import ForumTopicAction from './topic/actions';
import ForumGroupsAction from './group/actions';
import ForumThreadAction from './thread/actions';

type Action = ForumGroupsAction | ForumTopicAction | ForumThreadAction | ForumPostAction;
export default Action;