import * as React from 'react';
import { connect } from 'react-redux';

import Store from '../../store';
import IUser from '../../models/IUser';
import UserLink from '../links/UserLink';
import ForumPostCell from './ForumPostCell';
import IForumThread from '../../models/forums/IForumThread';

export type Props = {
    thread: IForumThread;
};

type ConnectedState = {
    author?: IUser;
};
type ConnectedDispatch = {};

type CombinedProps = Props & ConnectedDispatch & ConnectedState;
class ForumThreadRowComponent extends React.Component<CombinedProps> {
    public render() {
        const thread = this.props.thread;
        return (
            <tr>
                <ForumPostCell id={thread.latestPost} />
                <td>{thread.numberOfPosts}</td>
                <td><UserLink user={this.props.author} /></td>
            </tr>
        );
    }
}

const mapStateToProps = (state: Store.All, ownProps: Props): ConnectedState => {
    const createdBy = ownProps.thread && ownProps.thread.createdBy;
    const author = createdBy && state.sealed.users.byId[createdBy] as IUser || undefined;
    return {
        author: author
    };
};

const ForumThreadRow: React.ComponentClass<Props> =
    connect(mapStateToProps)(ForumThreadRowComponent);
export default ForumThreadRow;