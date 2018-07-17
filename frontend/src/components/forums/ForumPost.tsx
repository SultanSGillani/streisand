import * as React from 'react';
import { connect } from 'react-redux';

import Store from '../../state/store';
import IUser from '../../models/IUser';
import UserPost from '../generic/UserPost';
import { getItem } from '../../utilities/mapping';
import { ScreenSize } from '../../models/IDeviceInfo';
import IForumPost from '../../models/forums/IForumPost';
import { IDispatch } from '../../state/actions/ActionTypes';
import { updatePost } from '../../state/forum/post/actions/UpdatePostAction';
import { deleteForumPost, IActionProps } from '../../state/forum/post/actions/DeletePostAction';

export type Props = {
    page: number;
    post: IForumPost;
};

type ConnectedState = {
    author?: IUser;
    modifiedBy?: IUser;
    screenSize: ScreenSize;
};

type ConnectedDispatch = {
    deleteForumPost: (props: IActionProps) => void;
    updatePost: (id: number, content: string) => void;
};

type CombinedProps = Props & ConnectedDispatch & ConnectedState;
class ForumPostComponent extends React.Component<CombinedProps> {
    public render() {
        const { post, author, page } = this.props;
        const onDelete = () => {
            this.props.deleteForumPost({
                thread: post.thread,
                post: post.id,
                currentPage: page
            });
        };

        const onUpdate = (content: string) => {
            this.props.updatePost(post.id, content);
        };

        return (
            <UserPost
                post={post}
                author={author}
                modifiedBy={this.props.modifiedBy}
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
        author: getItem({
            fallback: true,
            id: props.post.author,
            byId: state.sealed.user.byId
        }),
        modifiedBy: getItem({
            fallback: true,
            id: props.post.modifiedBy,
            byId: state.sealed.user.byId
        })
    };
};

const mapDispatchToProps = (dispatch: IDispatch): ConnectedDispatch => ({
    deleteForumPost: (props: IActionProps) => dispatch(deleteForumPost(props)),
    updatePost: (id: number, content: string) => dispatch(updatePost(id, content))
});

const ForumPost: React.ComponentClass<Props> =
    connect(mapStateToProps, mapDispatchToProps)(ForumPostComponent);
export default ForumPost;