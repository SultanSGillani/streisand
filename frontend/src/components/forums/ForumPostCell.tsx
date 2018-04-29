import * as React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

import Store from '../../store';
import IUser from '../../models/IUser';
import UserLink from '../links/UserLink';
import { getDateDiff } from '../../utilities/dates';
import IForumPost from '../../models/forums/IForumPost';
import IForumThread from '../../models/forums/IForumThread';

export type Props = {
    id?: number;
};

type ConnectedState = {
    post: IForumPost;
    thread: IForumThread;
    author: IUser;
};
type ConnectedDispatch = {};

type CombinedProps = Props & ConnectedDispatch & ConnectedState;
class ForumPostCellComponent extends React.Component<CombinedProps> {
    public render() {
        const post = this.props.post;
        const thread = this.props.thread;

        if (!post) {
            return <td>No posts...</td>;
        }

        const posted = getDateDiff({ past: post.createdAt });
        const threadLink = <Link to={'/forum/thread/' + thread.id} title={thread.title}>{thread.title}</Link>;
        return (
            <td>
                <UserLink user={this.props.author} /> posted in {threadLink} {posted}
            </td>
        );
    }
}

const mapStateToProps = (state: Store.All, ownProps: Props): ConnectedState => {
    const postId = ownProps.id || ownProps.id === 0 ? ownProps.id : -1;
    const post = state.sealed.forums.posts.byId[postId] as IForumPost;
    const author = post && state.sealed.users.byId[post.author] as IUser;
    const thread = post && state.sealed.forums.threads.byId[post.thread];
    return {
        post: post,
        thread: thread as IForumThread,
        author: author
    };
};

const ForumPostCell: React.ComponentClass<Props> =
    connect(mapStateToProps)(ForumPostCellComponent);
export default ForumPostCell;