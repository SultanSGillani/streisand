import * as React from 'react';
import { connect } from 'react-redux';

import Store from '../../store';
import IUser from '../../models/IUser';
import NewPost from '../generic/NewPost';
import { getItem } from '../../utilities/mapping';
import { IDispatch } from '../../actions/ActionTypes';
import { IForumThread } from '../../models/forums/IForumThread';
import { IForumPostUpdate } from '../../models/forums/IForumPost';
import { postReply } from '../../actions/forums/posts/CreatePostAction';

export type Props = {
    thread: IForumThread;
};

type ConnectedState = {
    currentUser?: IUser;
};

type ConnectedDispatch = {
    postReply: (post: IForumPostUpdate) => void;
};

type CombinedProps = Props & ConnectedDispatch & ConnectedState;
class ForumReplyComponent extends React.Component<CombinedProps> {
    public render() {
        const onSave = (content: string) => {
            this.props.postReply({
                thread: this.props.thread.id,
                body: content
            });
        };

        return (
            <NewPost
                createPost={onSave}
                saveText="Post reply"
                author={this.props.currentUser}
                title="Post a new message for this thread"
            />
        );
    }
}

const mapStateToProps = (state: Store.All, props: Props): ConnectedState => {
    return {
        currentUser: getItem({
            id: state.sealed.currentUser.id,
            byId: state.sealed.user.byId
        })
    };
};

const mapDispatchToProps = (dispatch: IDispatch): ConnectedDispatch => ({
    postReply: (post: IForumPostUpdate) => dispatch(postReply(post))
});

const ForumReply: React.ComponentClass<Props> =
    connect(mapStateToProps, mapDispatchToProps)(ForumReplyComponent);
export default ForumReply;