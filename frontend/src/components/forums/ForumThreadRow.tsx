import * as React from 'react';
import * as redux from 'redux';
import { connect } from 'react-redux';

import Store from '../../store';
import IUser from '../../models/IUser';
import UserLink from '../links/UserLink';
import ForumPostCell from './ForumPostCell';
import EmptyThreadCell from './EmptyThreadCell';
import { getItem } from '../../utilities/mapping';
import IForumThread from '../../models/forums/IForumThread';
import { IDeleteThreadProps, deleteForumThread } from '../../actions/forums/threads/DeleteThreadAction';

export type Props = {
    page: number;
    thread: IForumThread;
};

type ConnectedState = {
    author?: IUser;
};
type ConnectedDispatch = {
    deleteForumThread: (props: IDeleteThreadProps) => void;
};

type CombinedProps = Props & ConnectedDispatch & ConnectedState;
class ForumThreadRowComponent extends React.Component<CombinedProps> {
    public render() {
        const thread = this.props.thread;
        const activity = thread.latestPost
            ? <ForumPostCell id={thread.latestPost} />
            : <EmptyThreadCell thread={thread} />;
        const onDelete = () => {
            this.props.deleteForumThread({
                topic: thread.topic,
                thread: thread.id,
                currentPage: this.props.page
            });
        };
        return (
            <tr>
                {activity}
                <td className="align-middle">{thread.numberOfPosts}</td>
                <td className="align-middle"><UserLink user={this.props.author} /></td>
                <td style={{ display: 'flex', flexFlow: 'row-reverse' }}>
                    <button className="btn btn-sm btn-danger" onClick={onDelete}>
                        <i className="fa fa-trash" style={{ fontSize: '14px' }} />
                    </button>
                </td>
            </tr>
        );
    }
}

const mapStateToProps = (state: Store.All, ownProps: Props): ConnectedState => {
    return {
        author: getItem({
            id: ownProps.thread && ownProps.thread.createdBy,
            byId: state.sealed.users.byId
        })
     };
};

const mapDispatchToProps = (dispatch: redux.Dispatch<Store.All>): ConnectedDispatch => ({
    deleteForumThread: (props: IDeleteThreadProps) => dispatch(deleteForumThread(props))
});

const ForumThreadRow: React.ComponentClass<Props> =
    connect(mapStateToProps, mapDispatchToProps)(ForumThreadRowComponent);
export default ForumThreadRow;