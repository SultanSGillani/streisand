import * as React from 'react';
import { connect } from 'react-redux';

import Store from '../../store';
import Avatar from '../users/Avatar';
import IUser from '../../models/IUser';
import UserLink from '../links/UserLink';
import TextView from '../bbcode/TextView';
import { getDateDiff } from '../../utilities/dates';
import IForumPost from '../../models/forums/IForumPost';

export type Props = {
    post: IForumPost;
};

type ConnectedState = {
    author: IUser;
};
type ConnectedDispatch = {};

type CombinedProps = Props & ConnectedDispatch & ConnectedState;
class ForumPostComponent extends React.Component<CombinedProps> {
    public render() {
        const post = this.props.post;
        const author = this.props.author;
        const posted = getDateDiff({ past: post.createdAt });
        return (
            <div>
                <div className="panel panel-default">
                    <div className="panel-heading">
                        <UserLink user={author} /> {posted}
                    </div>
                    <div className="panel-body" style={{ display: 'flex' }}>
                        <Avatar />
                        <div style={{ flex: 'auto', marginLeft: '8px' }}>
                            <TextView content={post.body || ''} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state: Store.All, ownProps: Props): ConnectedState => {
    const author = ownProps.post && state.sealed.users.byId[ownProps.post.author] as IUser;
    return {
        author: author
    };
};

const ForumPost: React.ComponentClass<Props> =
    connect(mapStateToProps)(ForumPostComponent);
export default ForumPost;