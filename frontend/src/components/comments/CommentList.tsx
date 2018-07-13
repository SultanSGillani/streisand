import * as React from 'react';
import { Table } from 'reactstrap';
import { connect } from 'react-redux';

import Pager from '../Pager';
import Store from '../../store';
import CommentRow from './CommentRow';
import Empty from '../generic/Empty';
import IFilm from '../../models/IFilm';
import Loading from '../generic/Loading';
import { IComment } from '../../models/IComment';
import { IDispatch } from '../../actions/ActionTypes';
import { getNodeItems } from '../../utilities/mapping';
import { getComments } from '../../actions/comments/CommentsAction';
import ILoadingStatus, { defaultStatus } from '../../models/base/ILoadingStatus';

export type Props = {
    page: number;
    film: IFilm;
    changePage: (page: number) => void;
};

type ConnectedState = {
    total: number;
    pageSize: number;
    comments: IComment[];
    status: ILoadingStatus;
};
type ConnectedDispatch = {
    getComments: (id: number, page?: number) => void;
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
        if (!comments.length) {
            return this.props.status.loading ? <Loading /> : <Empty />;
        }

        const pager = <Pager onPageChange={changePage} total={total} page={page} pageSize={pageSize} />;
        const rows = comments.map((comment: IComment) => {
            return (<CommentRow film={film} comment={comment} key={comment.id} />);
        });
        return (
            <div>
                <Table className="table-borderless" striped hover>
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>text</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                </Table>
                {pager}
            </div>
        );
    }
}

const mapStateToProps = (state: Store.All, props: Props): ConnectedState => {
    const list = state.sealed.comment.list;
    const page = list.pages[props.page];
    return {
        total: list.count,
        pageSize: list.pageSize,
        status: page ? page.status : defaultStatus,
        comments: getNodeItems({
            page: props.page,
            byId: state.sealed.comment.byId,
            pages: list.pages
        })
    };
};

const mapDispatchToProps = (dispatch: IDispatch): ConnectedDispatch => ({
    getComments: (id: number, page?: number) => dispatch(getComments(id, page))
});

const CommentList: React.ComponentClass<Props> =
    connect(mapStateToProps, mapDispatchToProps)(CommentListComponent);
export default CommentList;
