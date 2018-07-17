import * as React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

import Store from '../../state/store';
import IUser from '../../models/IUser';
import UserLink from '../links/UserLink';
import TimeElapsed from '../generic/TimeElapsed';
import { getItem } from '../../utilities/mapping';
import IForumPost from '../../models/forums/IForumPost';
import IForumThread from '../../models/forums/IForumThread';

export type Props = {
    id?: number;
};

type ConnectedState = {
    post: IForumPost;
    thread: IForumThread;
    author?: IUser;
};
type ConnectedDispatch = {};

type CombinedProps = Props & ConnectedDispatch & ConnectedState;
class ForumPostCellComponent extends React.Component<CombinedProps> {
    public render() {
        const post = this.props.post;
        const thread = this.props.thread;

        if (!post) {
            return <td className="align-middle">No posts...</td>;
        }

        const posted = <TimeElapsed date={post.createdAt} />;
        const threadLink = <Link to={'/forum/thread/' + thread.id} title={thread.title}>{thread.title}</Link>;
        return (
            <td className="align-middle">
                <UserLink user={this.props.author} /> posted in {threadLink} {posted}
            </td>
        );
    }
}

const mapStateToProps = (state: Store.All, props: Props): ConnectedState => {
    const postId = props.id || props.id === 0 ? props.id : -1;
    const post = state.sealed.forum.post.byId[postId];
    const thread = post && state.sealed.forum.thread.byId[post.thread];
    return {
        post: post as IForumPost,
        thread: thread as IForumThread,
        author: getItem({
            fallback: true,
            id: post && post.author,
            byId: state.sealed.user.byId
        })
    };
};

const ForumPostCell: React.ComponentClass<Props> =
    connect(mapStateToProps)(ForumPostCellComponent);
export default ForumPostCell;