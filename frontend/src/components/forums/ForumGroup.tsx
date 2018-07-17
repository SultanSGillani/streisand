import * as React from 'react';
import { Table } from 'reactstrap';
import { connect } from 'react-redux';

import Store from '../../state/store';
import ForumTopicRow from './ForumTopicRow';
import { ScreenSize } from '../../models/IDeviceInfo';
import IForumGroup from '../../models/forums/IForumGroup';
import IForumTopic from '../../models/forums/IForumTopic';

export type Props = {
    group: IForumGroup;
};

type ConnectedState = {
    topics: IForumTopic[];
    screenSize: ScreenSize;
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

        const full = this.props.screenSize > ScreenSize.small || undefined;
        return (
            <div>
                <h2>{group.title}</h2>
                <Table className="table-borderless" striped hover>
                    <thead>
                        <tr>
                            <th>Topic</th>
                            <th>Latest Post</th>
                            {full && <>
                                <th>Threads</th>
                                <th>Posts</th>
                                <th></th>
                            </>}
                        </tr>
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                </Table>
            </div>
        );
    }
}

const mapStateToProps = (state: Store.All, props: Props): ConnectedState => {
    const topics = (props.group.topics || []).map((topicId: number) => {
        return state.sealed.forum.topic.byId[topicId];
    });
    return {
        topics: topics as IForumTopic[],
        screenSize: state.deviceInfo.screenSize
    };
};

const ForumGroup: React.ComponentClass<Props> =
    connect(mapStateToProps)(ForumGroupComponent);
export default ForumGroup;