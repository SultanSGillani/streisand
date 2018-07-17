import * as React from 'react';
import { Table } from 'reactstrap';
import { connect } from 'react-redux';

import Pager from '../Pager';
import Store from '../../state/store';
import ForumThreadRow from './ForumThreadRow';
import { getItems } from '../../utilities/mapping';
import ForumThreadCreator from './ForumThreadCreator';
import { ScreenSize } from '../../models/IDeviceInfo';
import IForumTopic from '../../models/forums/IForumTopic';
import IForumThread from '../../models/forums/IForumThread';

export type Props = {
    page: number;
    topic: IForumTopic;
};

type ConnectedState = {
    total: number;
    pageSize: number;
    threads: IForumThread[];
    screenSize: ScreenSize;
};
type ConnectedDispatch = {};

type CombinedProps = Props & ConnectedDispatch & ConnectedState;
class ForumTopicViewComponent extends React.Component<CombinedProps> {
    public render() {
        const { page, topic, total, pageSize, threads } = this.props;
        const uri = `/forum/topic/${topic.id}`;
        const pager = <Pager uri={uri} total={total} page={page} pageSize={pageSize} />;
        const rows = threads.map((thread: IForumThread) => {
            return (<ForumThreadRow thread={thread} key={thread.id} page={page} />);
        });
        const full = this.props.screenSize > ScreenSize.small || undefined;
        return (
            <div>
                <h1>{topic.title}</h1>
                <p>{topic.description}</p>
                {pager}
                <Table className="table-borderless" striped hover>
                    <thead>
                        <tr>
                            <th>Thread Activity</th>
                            {full && <th>Posts</th>}
                            <th>Author</th>
                            {full && <th></th>}
                        </tr>
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                </Table>
                {pager}
                <ForumThreadCreator topic={topic} />
            </div>
        );
    }
}

const mapStateToProps = (state: Store.All, props: Props): ConnectedState => {
    const pages = state.sealed.forum.thread.byTopic[props.topic.id];
    return {
        total: pages ? pages.count : 0,
        pageSize: pages ? pages.pageSize : 0,
        screenSize: state.deviceInfo.screenSize,
        threads: getItems({
            page: props.page,
            byId: state.sealed.forum.thread.byId,
            pages: pages ? pages.pages : {}
        })
    };
};

const ForumTopicView: React.ComponentClass<Props> =
    connect(mapStateToProps)(ForumTopicViewComponent);
export default ForumTopicView;
