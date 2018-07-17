import * as React from 'react';
import { connect } from 'react-redux';

import Pager from '../Pager';
import ForumPost from './ForumPost';
import ForumReply from './ForumReply';
import Store from '../../state/store';
import { getItems } from '../../utilities/mapping';
import IForumPost from '../../models/forums/IForumPost';
import IForumThread from '../../models/forums/IForumThread';

export type Props = {
    page: number;
    thread: IForumThread;
};

type ConnectedState = {
    total: number;
    pageSize: number;
    posts: IForumPost[];
};
type ConnectedDispatch = {};

type CombinedProps = Props & ConnectedDispatch & ConnectedState;
class ForumThreadViewComponent extends React.Component<CombinedProps> {
    public render() {
        const { page, posts, total, pageSize, thread } = this.props;
        const uri = `/forum/thread/${thread.id}`;
        const pager = <Pager uri={uri} total={total} page={page} pageSize={pageSize} />;
        const rows = posts.map((post: IForumPost) => {
            return (<ForumPost post={post} key={post.id} page={page} />);
        });
        return (
            <div>
                <h1>{thread.title}</h1>
                {pager}
                <div>{rows}</div>
                {pager}
                <ForumReply thread={thread} />
            </div>
        );
    }
}

const mapStateToProps = (state: Store.All, props: Props): ConnectedState => {
    const pages = state.sealed.forum.post.byThread[props.thread.id];
    return {
        total: pages ? pages.count : 0,
        pageSize: pages ? pages.pageSize : 0,
        posts: getItems({
            page: props.page,
            byId: state.sealed.forum.post.byId,
            pages: pages ? pages.pages : {}
        })
    };
};

const ForumThreadView: React.ComponentClass<Props> =
    connect(mapStateToProps)(ForumThreadViewComponent);
export default ForumThreadView;
