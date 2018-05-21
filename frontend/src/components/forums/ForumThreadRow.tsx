import * as React from 'react';
import { connect } from 'react-redux';

import Store from '../../store';
import IUser from '../../models/IUser';
import UserLink from '../links/UserLink';
import ForumPostCell from './ForumPostCell';
import DeleteCell from '../generic/DeleteCell';
import EmptyThreadCell from './EmptyThreadCell';
import { getItem } from '../../utilities/mapping';
import { IDispatch } from '../../actions/ActionTypes';
import IForumThread from '../../models/forums/IForumThread';
import { IActionProps, deleteForumThread } from '../../actions/forums/threads/DeleteThreadAction';

export type Props = {
    page: number;
    thread: IForumThread;
};

type ConnectedState = {
    author?: IUser;
};
type ConnectedDispatch = {
    deleteForumThread: (props: IActionProps) => void;
};

type CombinedProps = Props & ConnectedDispatch & ConnectedState;
class ForumThreadRowComponent extends React.Component<CombinedProps> {
    public render() {
        const thread = this.props.thread;
        const activity = thread.latestPost
            ? <ForumPostCell id={thread.latestPost} />
            : <EmptyThreadCell thread={thread} />;
        const onDelete = () => {
            if (thread.topic) {
                this.props.deleteForumThread({
                    topic: thread.topic,
                    thread: thread.id,
                    currentPage: this.props.page
                });
            }
        };
        return (
            <tr>
                {activity}
                <td className="align-middle">{thread.numberOfPosts}</td>
                <td className="align-middle"><UserLink user={this.props.author} /></td>
                <DeleteCell onDelete={onDelete} />
            </tr>
        );
    }
}

const mapStateToProps = (state: Store.All, ownProps: Props): ConnectedState => {
    return {
        author: getItem({
            fallback: true,
            id: ownProps.thread && ownProps.thread.createdBy,
            byId: state.sealed.users.byId
        })
    };
};

const mapDispatchToProps = (dispatch: IDispatch): ConnectedDispatch => ({
    deleteForumThread: (props: IActionProps) => dispatch(deleteForumThread(props))
});

const ForumThreadRow: React.ComponentClass<Props> =
    connect(mapStateToProps, mapDispatchToProps)(ForumThreadRowComponent);
export default ForumThreadRow;