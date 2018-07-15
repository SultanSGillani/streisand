import * as React from 'react';
import { connect } from 'react-redux';

import Store from '../../store';
import IUser from '../../models/IUser';
import IFilm from '../../models/IFilm';
import UserPost from '../generic/UserPost';
import { IComment } from '../../models/IComment';
import { getItem } from '../../utilities/mapping';
import { ScreenSize } from '../../models/IDeviceInfo';
import { IDispatch } from '../../actions/ActionTypes';
import { deleteComment, IActionProps } from '../../actions/comments/DeleteCommentAction';
import { updateComment } from '../../actions/comments/UpdateCommentAction';

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
    updateComment: (id: number, content: string) => void;
};

type CombinedProps = Props & ConnectedDispatch & ConnectedState;
class CommentRowComponent extends React.Component<CombinedProps> {
    public render() {
        const { comment, user } = this.props;

        const onDelete = () => {
            this.props.deleteComment({
                id: comment.id,
                currentPage: 1,
                film: this.props.film.id
            });
         };

        const onUpdate = (content: string) => {
            this.props.updateComment(comment.id, content);
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
    updateComment: (id: number, content: string) => dispatch(updateComment(id, content))
});

const CommentRow: React.ComponentClass<Props> =
    connect(mapStateToProps, mapDispatchToProps)(CommentRowComponent);
export default CommentRow;