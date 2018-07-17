
import CommentsAction from './CommentsAction';
import CreateCommentAction from './CreateCommentAction';
import CommentUpdateAction from './UpdateCommentAction';
import DeleteCommentAction from './DeleteCommentAction';

type Action = CommentsAction | CreateCommentAction | CommentUpdateAction | DeleteCommentAction;
export default Action;
