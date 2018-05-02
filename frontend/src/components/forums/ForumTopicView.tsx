import * as React from 'react';
import { connect } from 'react-redux';

import Pager from '../Pager';
import Empty from '../Empty';
import Store from '../../store';
import ForumThreadRow from './ForumThreadRow';
import IForumTopic from '../../models/forums/IForumTopic';
import IForumThread from '../../models/forums/IForumThread';

export type Props = {
    page: number;
    topic: IForumTopic;
};

type ConnectedState = {
    total: number;
    threads: IForumThread[];
    loading: boolean;
};
type ConnectedDispatch = {};

type CombinedProps = Props & ConnectedDispatch & ConnectedState;
class ForumTopicViewComponent extends React.Component<CombinedProps> {
    public render() {
        const threads = this.props.threads;
        const uri = `/forum/topic/${this.props.topic.id}`;
        if (!threads.length) {
            return <Empty loading={this.props.loading} />;
        }
        const rows = threads.map((thread: IForumThread) => {
            return (<ForumThreadRow thread={thread} key={thread.id} />);
        });
        return (
            <div>
                <Pager uri={uri} total={this.props.total} page={this.props.page} />
                <table className="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th>Thread Activity</th>
                            <th>Posts</th>
                            <th>Author</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                </table>
                <Pager uri={uri} total={this.props.total} page={this.props.page} />
            </div>
        );
    }
}

const mapStateToProps = (state: Store.All, ownProps: Props): ConnectedState => {
    const topicPages = state.sealed.forums.threads.byTopic[ownProps.topic.id];
    const page = topicPages && topicPages.pages[ownProps.page];
    return {
        total: topicPages ? topicPages.count : 0,
        loading: page ? page.loading : false,
        threads: page ? page.items : []
    };
};

const ForumTopicView: React.ComponentClass<Props> =
    connect(mapStateToProps)(ForumTopicViewComponent);
export default ForumTopicView;
