import * as React from 'react';
import { connect } from 'react-redux';

import Store from '../../store';
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
class ForumThreadRowComponent extends React.Component<CombinedProps> {
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
                        <div>
                            <img src="https://i.imgur.com/2Gi9kAm.png" width="150" />
                        </div>
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

const ForumThreadRow: React.ComponentClass<Props> =
    connect(mapStateToProps)(ForumThreadRowComponent);
export default ForumThreadRow;