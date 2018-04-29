import * as React from 'react';
import { connect } from 'react-redux';

import Store from '../../store';
import ForumTopicRow from './ForumTopicRow';
import IForumGroup from '../../models/forums/IForumGroup';
import IForumTopic from '../../models/forums/IForumTopic';

export type Props = {
    group: IForumGroup;
};

type ConnectedState = {
    topics: IForumTopic[];
};
type ConnectedDispatch = {};

type CombinedProps = Props & ConnectedDispatch & ConnectedState;
class ForumGroupComponent extends React.Component<CombinedProps> {
    public render() {
        const group = this.props.group;
        const topics = this.props.topics;
        const rows = topics.map((topic: IForumTopic) => {
            return (<ForumTopicRow topic={topic} key={topic.id} />);
        });

        if (!rows.length) {
            return (
                <div>
                    <h2>{group.title}</h2>
                    <div>There are currently no forum topics in this group.</div>
                </div>
            );
        }
        return (
            <div>
                <h2>{group.title}</h2>
                <table className="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th>Topic</th>
                            <th>Latest Post</th>
                            <th>Threads</th>
                            <th>Posts</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                </table>
            </div>
        );
    }
}

const mapStateToProps = (state: Store.All, ownProps: Props): ConnectedState => {
    const topics = (ownProps.group.topics || []).map((topicId: number) => {
        return state.sealed.forums.topics.byId[topicId];
    });
    return {
        topics: topics as IForumTopic[]
    };
};

const ForumGroup: React.ComponentClass<Props> =
    connect(mapStateToProps)(ForumGroupComponent);
export default ForumGroup;