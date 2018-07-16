import * as React from 'react';
import { connect } from 'react-redux';

import Store from '../../store';
import Empty from '../../components/generic/Empty';
import { IDispatch } from '../../state/actions/ActionTypes';
import Loading from '../../components/generic/Loading';
import IForumThread from '../../models/forums/IForumThread';
import ForumThreadView from '../../components/forums/ForumThreadView';
import { numericIdentifier, parsePageNumber } from '../../utilities/shim';
import { getPosts } from '../../actions/forums/threads/ForumThreadAction';
import ILoadingStatus, { defaultStatus } from '../../models/base/ILoadingStatus';

export type Props = {
    params: {
        threadId: string;
        page: string;
    };
};

type ConnectedState = {
    page: number;
    threadId: number;
    status: ILoadingStatus;
    thread?: IForumThread;
};

type ConnectedDispatch = {
    getPosts: (id: number, page: number) => void;
};

type CombinedProps = ConnectedState & ConnectedDispatch & Props;
class ForumThreadPageComponent extends React.Component<CombinedProps, void> {
    public componentWillMount() {
        if (!this.props.status.loading) {
            this.props.getPosts(this.props.threadId, this.props.page);
        }
    }

    public componentWillReceiveProps(props: CombinedProps) {
        const status = props.status;
        const needPage = !status.failed && (!status.loaded || status.outdated);
        const pageChanged = props.page !== this.props.page || props.threadId !== this.props.threadId;
        if (!props.status.loading && (pageChanged || needPage)) {
            this.props.getPosts(props.threadId, props.page);
        }
    }

    public render() {
        const thread = this.props.thread;
        if (!thread) {
            return this.props.status.loading ? <Loading /> : <Empty />;
        }

        return (
            <ForumThreadView thread={thread} page={this.props.page} />
        );
    }
}

const mapStateToProps = (state: Store.All, props: Props): ConnectedState => {
    const pageNumber = parsePageNumber(props.params && props.params.page);
    const threadId = numericIdentifier(props.params.threadId);
    const threadPages = state.sealed.forums.posts.byThread[threadId];
    const page = threadPages && threadPages.pages[pageNumber];
    const item = state.sealed.forums.threads.byId[threadId];
    const thread = item || undefined;

    return {
        thread: thread,
        page: pageNumber,
        threadId: threadId,
        status: page ? page.status : defaultStatus
    };
};

const mapDispatchToProps = (dispatch: IDispatch): ConnectedDispatch => ({
    getPosts: (id: number, page: number) => dispatch(getPosts(id, page))
});

const ForumThreadPage: React.ComponentClass<Props> =
    connect(mapStateToProps, mapDispatchToProps)(ForumThreadPageComponent);
export default ForumThreadPage;
