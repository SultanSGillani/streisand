import * as React from 'react';
import { connect } from 'react-redux';

import Pager from '../Pager';
import Store from '../../store';
import CommentRow from './CommentRow';
import IFilm from '../../models/IFilm';
import IUser from '../../models/IUser';
import Loading from '../generic/Loading';
import NewPost from '../generic/NewPost';
import { IComment } from '../../models/IComment';
import { IDispatch } from '../../actions/ActionTypes';
import ILoadingStatus from '../../models/base/ILoadingStatus';
import { getComments } from '../../actions/comments/CommentsAction';
import { createComment } from '../../actions/comments/CreateCommentAction';
import { getNodeItems, getList, getItemPage, getItem } from '../../utilities/mapping';

export type Props = {
    page: number;
    film: IFilm;
    changePage: (page: number) => void;
};

type ConnectedState = {
    total: number;
    pageSize: number;
    currentUser?: IUser;
    comments: IComment[];
    status: ILoadingStatus;
};
type ConnectedDispatch = {
    getComments: (id: number, page?: number) => void;
    createComment: (film: number, text: string) => void;
};

type CombinedProps = Props & ConnectedDispatch & ConnectedState;
class CommentListComponent extends React.Component<CombinedProps> {
    public componentWillMount() {
        if (!this.props.status.loading) {
            this.props.getComments(this.props.film.id, this.props.page);
        }
    }

    public componentDidUpdate(props: CombinedProps) {
        const status = this.props.status;
        const changed = props.film.id !== this.props.film.id
            || props.page !== this.props.page;
        const needUpdate = !status.failed && (!status.loaded || status.outdated);
        if (!status.loading && (changed || needUpdate)) {
            this.props.getComments(this.props.film.id, this.props.page);
        }
    }

    public render() {
        const { film, comments, page, total, pageSize, changePage } = this.props;

        const onSave = (content: string) => this.props.createComment(film.id, content);
        const pager = <Pager onPageChange={changePage} total={total} page={page} pageSize={pageSize} />;
        const rows = comments.map((comment: IComment) => {
            return (<CommentRow film={film} comment={comment} key={comment.id} />);
        });
        const commentList = !comments.length && this.props.status.loading ? <Loading /> : (
            <>
                {pager}
                {rows}
                {pager}
            </>
        );
        return (
            <>
                <h2>Comments</h2>
                <NewPost
                    createPost={onSave}
                    saveText="Post comment"
                    author={this.props.currentUser}
                    title="Post a new comment for this film"
                />
                {commentList}
            </>
        );
    }
}

const mapStateToProps = (state: Store.All, props: Props): ConnectedState => {
    const list = getList(state.sealed.comment.byFilmId[props.film.id]);
    const page = getItemPage({ list, page: props.page });
    return {
        total: list.count,
        status: page.status,
        pageSize: list.pageSize,
        currentUser: getItem({
            id: state.sealed.currentUser.id,
            byId: state.sealed.user.byId
        }),
        comments: getNodeItems({
            page: props.page,
            byId: state.sealed.comment.byId,
            pages: list.pages
        })
    };
};

const mapDispatchToProps = (dispatch: IDispatch): ConnectedDispatch => ({
    getComments: (id: number, page?: number) => dispatch(getComments(id, page)),
    createComment: (film: number, text: string) => dispatch(createComment({ film, text }))
});

const CommentList: React.ComponentClass<Props> =
    connect(mapStateToProps, mapDispatchToProps)(CommentListComponent);
export default CommentList;
