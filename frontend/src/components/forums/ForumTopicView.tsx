import * as React from 'react';
import { connect } from 'react-redux';

import Pager from '../Pager';
import Store from '../../store';
import ForumThreadRow from './ForumThreadRow';
import IForumTopic from '../../models/forums/IForumTopic';
import IForumThread from '../../models/forums/IForumThread';
import ForumThreadCreator from './ForumThreadCreator';

export type Props = {
    page: number;
    topic: IForumTopic;
};

type ConnectedState = {
    total: number;
    threads: IForumThread[];
};
type ConnectedDispatch = {};

type CombinedProps = Props & ConnectedDispatch & ConnectedState;
class ForumTopicViewComponent extends React.Component<CombinedProps> {
    public render() {
        const page = this.props.page;
        const topic = this.props.topic;
        const threads = this.props.threads;
        const uri = `/forum/topic/${topic.id}`;
        const rows = threads.map((thread: IForumThread) => {
            return (<ForumThreadRow thread={thread} key={thread.id} page={page} />);
        });
        return (
            <div>
                <h1>{topic.title}</h1>
                <p>{topic.description}</p>
                <Pager uri={uri} total={this.props.total} page={page} />
                <table className="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th>Thread Activity</th>
                            <th>Posts</th>
                            <th>Author</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                </table>
                <Pager uri={uri} total={this.props.total} page={page} />
                <ForumThreadCreator topic={topic} />
            </div>
        );
    }
}

const mapStateToProps = (state: Store.All, ownProps: Props): ConnectedState => {
    const topicPages = state.sealed.forums.threads.byTopic[ownProps.topic.id];
    const page = topicPages && topicPages.pages[ownProps.page];
    const threads = (page ? page.items : []).map((id: number) => {
        return state.sealed.forums.threads.byId[id];
    });
    return {
        total: topicPages ? topicPages.count : 0,
        threads: threads
    };
};

const ForumTopicView: React.ComponentClass<Props> =
    connect(mapStateToProps)(ForumTopicViewComponent);
export default ForumTopicView;
