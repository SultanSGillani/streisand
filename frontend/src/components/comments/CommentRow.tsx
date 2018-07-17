import * as React from 'react';
import { connect } from 'react-redux';

import Store from '../../state/store';
import IUser from '../../models/IUser';
import IFilm from '../../models/IFilm';
import UserPost from '../generic/UserPost';
import { getItem } from '../../utilities/mapping';
import { ScreenSize } from '../../models/IDeviceInfo';
import { IDispatch } from '../../state/actions/ActionTypes';
import { IComment, ICommentUpdate } from '../../models/IComment';
import { updateComment } from '../../state/comment/actions/UpdateCommentAction';
import { deleteComment, IActionProps } from '../../state/comment/actions/DeleteCommentAction';

export type Props = {
    film: IFilm;
    comment: IComment;
};

type ConnectedState = {
    user?: IUser;
    screenSize: ScreenSize;
};

type ConnectedDispatch = {
    deleteComment: (props: IActionProps) => void;
    updateComment: (update: ICommentUpdate) => void;
};

type CombinedProps = Props & ConnectedDispatch & ConnectedState;
class CommentRowComponent extends React.Component<CombinedProps> {
    public render() {
        const { film, comment, user } = this.props;

        const onDelete = () => {
            this.props.deleteComment({
                id: comment.id,
                currentPage: 1,
                film: film.id
            });
         };

        const onUpdate = (content: string) => {
            this.props.updateComment({
                id: comment.id,
                film: film.id,
                text: content
            });
         };

        return (
            <UserPost
                post={comment}
                author={user}
                screenSize={this.props.screenSize}
                deletePost={onDelete}
                updatePost={onUpdate}
            />
        );
    }
}

const mapStateToProps = (state: Store.All, props: Props): ConnectedState => {
    return {
        screenSize: state.deviceInfo.screenSize,
        user: getItem({
            id: props.comment.author,
            byId: state.sealed.user.byId
        })
    };
};

const mapDispatchToProps = (dispatch: IDispatch): ConnectedDispatch => ({
    deleteComment: (props: IActionProps) => dispatch(deleteComment(props)),
    updateComment: (update: ICommentUpdate) => dispatch(updateComment(update))
});

const CommentRow: React.ComponentClass<Props> =
    connect(mapStateToProps, mapDispatchToProps)(CommentRowComponent);
export default CommentRow;