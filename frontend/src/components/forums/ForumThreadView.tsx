import * as React from 'react';
import { connect } from 'react-redux';

import Pager from '../Pager';
import Empty from '../Empty';
import Store from '../../store';
import ForumPost from './ForumPost';
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
class ForumTopicViewComponent extends React.Component<CombinedProps> {
    public render() {
        const posts = this.props.posts;
        const uri = `/forum/thread/${this.props.thread.id}`;
        if (!posts.length) {
            return <Empty loading={this.props.loading} />;
        }
        const rows = posts.map((post: IForumPost) => {
            return (<ForumPost post={post} key={post.id} />);
        });
        return (
            <div>
                <Pager uri={uri} total={this.props.total} page={this.props.page} />
                <div>{rows}</div>
                <Pager uri={uri} total={this.props.total} page={this.props.page} />
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

const ForumTopicView: React.ComponentClass<Props> =
    connect(mapStateToProps)(ForumTopicViewComponent);
export default ForumTopicView;
