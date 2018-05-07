import ForumTopicAction from './ForumTopicAction';
import CreateTopicAction from './CreateTopicAction';
import DeleteTopicAction from './DeleteTopicAction';

type Action = ForumTopicAction | CreateTopicAction | DeleteTopicAction;
export default Action;