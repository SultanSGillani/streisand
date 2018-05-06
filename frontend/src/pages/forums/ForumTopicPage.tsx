import * as React from 'react';
import * as redux from 'redux';
import { connect } from 'react-redux';

import Store from '../../store';
import Empty from '../../components/Empty';
import { numericIdentifier } from '../../utilities/shim';
import IForumTopic from '../../models/forums/IForumTopic';
import ForumTopicView from '../../components/forums/ForumTopicView';
import { getThreads } from '../../actions/forums/topics/ForumTopicAction';
import ILoadingStatus, { defaultStatus } from '../../models/base/ILoadingStatus';

export type Props = {
    params: {
        topicId: string;
        page: string;
    };
};

type ConnectedState = {
    page: number;
    topicId: number;
    status: ILoadingStatus;
    topic?: IForumTopic;
};

type ConnectedDispatch = {
    getThreads: (id: number, page: number) => void;
};

type CombinedProps = ConnectedState & ConnectedDispatch & Props;
class ForumTopicPageComponent extends React.Component<CombinedProps, void> {
    public componentWillMount() {
        if (!this.props.status.loading) {
            this.props.getThreads(this.props.topicId, this.props.page);
        }
    }

    public componentWillReceiveProps(props: CombinedProps) {
        const status = props.status;
        const needPage = !status.failed && (!status.loaded || status.outdated);
        const pageChanged = props.page !== this.props.page || props.topicId !== this.props.topicId;
        if (!status.loading && (pageChanged || needPage)) {
            this.props.getThreads(props.topicId, props.page);
        }
    }

    public render() {
        const topic = this.props.topic;
        if (!topic || !this.props.status.loaded) {
            return <Empty loading={this.props.status.loading} />;
        }

        return (
            <ForumTopicView topic={topic} page={this.props.page} />
        );
    }
}

const mapStateToProps = (state: Store.All, ownProps: Props): ConnectedState => {
    const pageNumber = Number((ownProps.params && ownProps.params.page) || 1);
    const topicId = numericIdentifier(ownProps.params.topicId);
    const topicPages = state.sealed.forums.threads.byTopic[topicId];
    const page = topicPages && topicPages.pages[pageNumber];
    const item = state.sealed.forums.topics.byId[topicId];
    const topic = item || undefined;

    return {
        topic: topic,
        page: pageNumber,
        topicId: topicId,
        status: page ? page.status : defaultStatus
    };
};

const mapDispatchToProps = (dispatch: redux.Dispatch<Store.All>): ConnectedDispatch => ({
    getThreads: (id: number, page: number) => dispatch(getThreads(id, page))
});

const ForumTopicPage: React.ComponentClass<Props> =
    connect(mapStateToProps, mapDispatchToProps)(ForumTopicPageComponent);
export default ForumTopicPage;
