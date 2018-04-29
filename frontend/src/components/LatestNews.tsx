import * as React from 'react';
import * as redux from 'redux';
import { connect } from 'react-redux';

import Store from '../store';
import Empty from './Empty';
import { getLatestNews } from '../actions/NewsAction';
import TextView from './bbcode/TextView';
import { getDateDiff } from '../utilities/dates';
import UserLink from './links/UserLink';
import { IForumPost } from '../models/forums/IForumPost';
import IUser from '../models/IUser';
import { IForumThread } from '../models/forums/IForumThread';

export type Props = {};

type ConnectedState = {
    post?: IForumPost;
    author?: IUser;
    thread?: IForumThread;
    loading: boolean;
    loaded: boolean;
};

type ConnectedDispatch = {
    getLatestNews: () => void;
};

type CombinedProps = ConnectedState & ConnectedDispatch & Props;
class LatestNewsComponent extends React.Component<CombinedProps, void> {
    public componentWillMount() {
        if (!this.props.loading && !this.props.loaded) {
            this.props.getLatestNews();
        }
    }

    public componentWillReceiveProps(props: CombinedProps) {
        if (!props.loading && !props.loaded) {
            this.props.getLatestNews();
        }
    }

    public render() {
        const post = this.props.post;
        if (this.props.loading || !post) {
            return <Empty loading={this.props.loading} />;
        }

        if (post.id === undefined) {
            return (
                <div className="panel panel-default">
                    <div className="panel-heading">Latest news</div>
                    <div className="panel-body">
                        <TextView content="Welcome! There are currently no news posts on the site yet." />
                    </div>
                </div>
            );
        }

        const thread = this.props.thread || { title: '' };
        const posted = getDateDiff({ past: post.createdAt });

        return (
            <div className="panel panel-default">
                <div className="panel-heading">{thread.title} - posted by <UserLink user={this.props.author} /> { posted }</div>
                <div className="panel-body">
                    <TextView content={post.body || ''} />
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state: Store.All, ownProps: Props): ConnectedState => {
    const loading = state.sealed.news.loading;
    const loaded = !loading && !!state.sealed.news.latest;
    const post = state.sealed.news.latest ? state.sealed.forums.posts.byId[state.sealed.news.latest] : undefined;
    const author = post && state.sealed.users.byId[post.author] as IUser;
    const thread = post && state.sealed.forums.threads.byId[post.thread] as IForumThread;

    return { post, author, thread, loading, loaded };
};

const mapDispatchToProps = (dispatch: redux.Dispatch<Store.All>): ConnectedDispatch => ({
    getLatestNews: () => dispatch(getLatestNews())
});

const LatestNews: React.ComponentClass<Props> =
    connect(mapStateToProps, mapDispatchToProps)(LatestNewsComponent);
export default LatestNews;
