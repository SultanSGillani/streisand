import * as React from 'react';
import { connect } from 'react-redux';
import { Card, CardHeader, CardBody, CardTitle } from 'reactstrap';

import Empty from './Empty';
import Store from '../store';
import IUser from '../models/IUser';
import UserLink from './links/UserLink';
import TextView from './bbcode/TextView';
import { getItem } from '../utilities/mapping';
import { getDateDiff } from '../utilities/dates';
import { IDispatch } from '../actions/ActionTypes';
import { getLatestNews } from '../actions/NewsAction';
import { IForumPost } from '../models/forums/IForumPost';
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
                <Card>
                    <CardHeader>Latest news</CardHeader>
                    <CardBody>
                        <TextView content="Welcome! There are currently no news posts on the site yet." />
                    </CardBody>
                </Card>
            );
        }

        const thread = this.props.thread || { title: '' };
        const posted = getDateDiff({ past: post.createdAt });
        return (
            <Card>
                <CardHeader>
                    <div className="row">
                        <div className="col-auto">Latest news</div>
                        <div className="col-auto ml-auto">
                            <small>posted by <UserLink user={this.props.author} /> {posted}</small>
                        </div>
                    </div>
                </CardHeader>
                <CardBody>
                    <CardTitle>{thread.title}</CardTitle>
                    <TextView content={post.body || ''} />
                </CardBody>
            </Card>
        );
    }
}

const mapStateToProps = (state: Store.All, ownProps: Props): ConnectedState => {
    const loading = state.sealed.news.loading;
    const loaded = !loading && !!state.sealed.news.latest;
    const post = state.sealed.news.latest ? state.sealed.forums.posts.byId[state.sealed.news.latest] : undefined;
    const author = getItem({
        fallback: true,
        id: post && post.author,
        byId: state.sealed.users.byId
    });
    const thread = post && state.sealed.forums.threads.byId[post.thread] as IForumThread;

    return { post, author, thread, loading, loaded };
};

const mapDispatchToProps = (dispatch: IDispatch): ConnectedDispatch => ({
    getLatestNews: () => dispatch(getLatestNews())
});

const LatestNews: React.ComponentClass<Props> =
    connect(mapStateToProps, mapDispatchToProps)(LatestNewsComponent);
export default LatestNews;
