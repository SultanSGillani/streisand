import * as React from 'react';
import { connect } from 'react-redux';
import { Card, CardHeader, CardBody, CardTitle } from 'reactstrap';

import Store from '../state/store';
import Empty from './generic/Empty';
import IUser from '../models/IUser';
import UserLink from './links/UserLink';
import Loading from './generic/Loading';
import TextView from './bbcode/TextView';
import { getItem } from '../utilities/mapping';
import TimeElapsed from './generic/TimeElapsed';
import { IDispatch } from '../state/actions/ActionTypes';
import { IForumPost } from '../models/forums/IForumPost';
import { IForumThread } from '../models/forums/IForumThread';
import { getLatestNews } from '../state/news/actions/NewsAction';

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
class LatestNewsComponent extends React.Component<CombinedProps> {
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
        if (!post) {
            return this.props.loading ? <Loading /> : <Empty />;
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
        const posted = <TimeElapsed date={ post.createdAt } />;
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

const mapStateToProps = (state: Store.All, props: Props): ConnectedState => {
    const loading = state.sealed.news.loading;
    const loaded = !loading && !!state.sealed.news.latest;
    const post = state.sealed.news.latest ? state.sealed.forum.post.byId[state.sealed.news.latest] : undefined;
    const author = getItem({
        fallback: true,
        id: post && post.author,
        byId: state.sealed.user.byId
    });
    const thread = post && state.sealed.forum.thread.byId[post.thread] as IForumThread;

    return { post, author, thread, loading, loaded };
};

const mapDispatchToProps = (dispatch: IDispatch): ConnectedDispatch => ({
    getLatestNews: () => dispatch(getLatestNews())
});

const LatestNews: React.ComponentClass<Props> =
    connect(mapStateToProps, mapDispatchToProps)(LatestNewsComponent);
export default LatestNews;
