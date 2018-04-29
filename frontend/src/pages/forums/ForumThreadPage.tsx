import * as React from 'react';
import * as redux from 'redux';
import { connect } from 'react-redux';

import Store from '../../store';
import Empty from '../../components/Empty';
import { numericIdentifier } from '../../utilities/shim';
import IForumThread from '../../models/forums/IForumThread';
import { isLoadingItem } from '../../models/base/ILoadingItem';
import { getPosts } from '../../actions/forums/ForumThreadAction';
import ForumThreadView from '../../components/forums/ForumThreadView';

export type Props = {
    params: {
        threadId: string;
        page: string;
    };
};

type ConnectedState = {
    page: number;
    threadId: number;
    loading: boolean;
    thread?: IForumThread;
};

type ConnectedDispatch = {
    getPosts: (id: number, page: number) => void;
};

type CombinedProps = ConnectedState & ConnectedDispatch & Props;
class ForumThreadPageComponent extends React.Component<CombinedProps, void> {
    public componentWillMount() {
        if (!this.props.loading) {
            this.props.getPosts(this.props.threadId, this.props.page);
        }
    }

    public componentWillReceiveProps(props: CombinedProps) {
        if (!props.loading && (!props.thread || props.page !== this.props.page)) {
            this.props.getPosts(props.threadId, props.page);
        }
    }

    public render() {
        const thread = this.props.thread;
        if (!thread) {
            return <Empty loading={true} />;
        }

        return (
            <ForumThreadView thread={thread} page={this.props.page} />
        );
    }
}

const mapStateToProps = (state: Store.All, ownProps: Props): ConnectedState => {
    const pageNumber = Number((ownProps.params && ownProps.params.page) || 1);
    const threadId = numericIdentifier(ownProps.params.threadId);
    const threadPages = state.sealed.forums.posts.byThread[threadId];
    const page = threadPages && threadPages.pages[pageNumber];
    const item = state.sealed.forums.threads.byId[threadId];
    const thread = !isLoadingItem(item) && item || undefined;

    return {
        thread: thread,
        page: pageNumber,
        threadId: threadId,
        loading: page ? page.loading : false
    };
};

const mapDispatchToProps = (dispatch: redux.Dispatch<Store.All>): ConnectedDispatch => ({
    getPosts: (id: number, page: number) => dispatch(getPosts(id, page))
});

const ForumThreadPage: React.ComponentClass<Props> =
    connect(mapStateToProps, mapDispatchToProps)(ForumThreadPageComponent);
export default ForumThreadPage;
