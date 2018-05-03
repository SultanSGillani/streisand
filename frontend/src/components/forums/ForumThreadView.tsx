import * as React from 'react';
import { connect } from 'react-redux';

import Pager from '../Pager';
// import Empty from '../Empty';
import Store from '../../store';
import ForumPost from './ForumPost';
import ForumReply from './ForumReply';
import IForumPost from '../../models/forums/IForumPost';
import IForumThread from '../../models/forums/IForumThread';

export type Props = {
    page: number;
    thread: IForumThread;
};

type ConnectedState = {
    total: number;
    posts: IForumPost[];
    loading: boolean;
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
    const page = threadPages && threadPages.pages[ownProps.page];
    return {
        total: threadPages ? threadPages.count : 0,
        loading: page ? page.loading : false,
        posts: page ? page.items : []
    };
};

const ForumThreadView: React.ComponentClass<Props> =
    connect(mapStateToProps)(ForumThreadViewComponent);
export default ForumThreadView;
