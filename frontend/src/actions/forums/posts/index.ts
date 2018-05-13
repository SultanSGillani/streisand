import CreatePostAction from './CreatePostAction';
import DeletePostAction from './DeletePostAction';
import UpdatePostAction from './UpdatePostAction';

type Action = CreatePostAction | DeletePostAction | UpdatePostAction;
export default Action;