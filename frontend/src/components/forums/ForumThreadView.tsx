import * as React from 'react';
import { connect } from 'react-redux';

import Pager from '../Pager';
import Store from '../../store';
import ForumPost from './ForumPost';
import ForumReply from './ForumReply';
import { getItems } from '../../utilities/mapping';
import IForumPost from '../../models/forums/IForumPost';
import IForumThread from '../../models/forums/IForumThread';

export type Props = {
    page: number;
    thread: IForumThread;
};

type ConnectedState = {
    total: number;
    posts: IForumPost[];
};
type ConnectedDispatch = {};

type CombinedProps = Props & ConnectedDispatch & ConnectedState;
class ForumThreadViewComponent extends React.Component<CombinedProps> {
    public render() {
        const { page, posts, total, thread } = this.props;
        const uri = `/forum/thread/${thread.id}`;
        const rows = posts.map((post: IForumPost) => {
            return (<ForumPost post={post} key={post.id} page={page} />);
        });
        return (
            <div>
                <Pager uri={uri} total={total} page={page} />
                <div>{rows}</div>
                <ForumReply thread={thread} />
                <Pager uri={uri} total={total} page={page} />
            </div>
        );
    }
}

const mapStateToProps = (state: Store.All, ownProps: Props): ConnectedState => {
    const threadPages = state.sealed.forums.posts.byThread[ownProps.thread.id];
    return {
        total: threadPages ? threadPages.count : 0,
        posts: getItems({
            page: ownProps.page,
            byId: state.sealed.forums.posts.byId,
            pages: threadPages ? threadPages.pages : {}
        })
    };
};

const ForumThreadView: React.ComponentClass<Props> =
    connect(mapStateToProps)(ForumThreadViewComponent);
export default ForumThreadView;
