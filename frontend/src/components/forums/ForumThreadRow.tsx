import * as React from 'react';
import { Link } from 'react-router';
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

function EmptyThreadCell(props: Props) {
    const thread = props.thread;
    const threadLink = <Link to={'/forum/thread/' + thread.id} title={thread.title}>{thread.title}</Link>;
    return (
        <td>No posts in {threadLink}</td>
    );
}

type CombinedProps = Props & ConnectedDispatch & ConnectedState;
class ForumThreadRowComponent extends React.Component<CombinedProps> {
    public render() {
        const thread = this.props.thread;
        const activity = thread.latestPost
            ? <ForumPostCell id={thread.latestPost} />
            : <EmptyThreadCell thread={thread} />;
        return (
            <tr>
                {activity}
                <td>{thread.numberOfPosts}</td>
                <td><UserLink user={this.props.author} /></td>
            </tr>
        );
    }
}

const mapStateToProps = (state: Store.All, ownProps: Props): ConnectedState => {
    const createdBy = ownProps.thread && ownProps.thread.createdBy;
    const author = createdBy && state.sealed.users.byId[createdBy] as IUser || undefined;
    return { author };
};

const ForumThreadRow: React.ComponentClass<Props> =
    connect(mapStateToProps)(ForumThreadRowComponent);
export default ForumThreadRow;