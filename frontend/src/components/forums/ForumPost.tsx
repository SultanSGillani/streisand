import * as React from 'react';
import * as redux from 'redux';
import { connect } from 'react-redux';

import Store from '../../store';
import Avatar from '../users/Avatar';
import IUser from '../../models/IUser';
import UserLink from '../links/UserLink';
import TextView from '../bbcode/TextView';
import { getDateDiff } from '../../utilities/dates';
import IForumPost from '../../models/forums/IForumPost';
import { IDeletePostProps, deleteForumPost } from '../../actions/forums/DeletePostAction';

export type Props = {
    page: number;
    post: IForumPost;
};

type ConnectedState = {
    author: IUser;
};
type ConnectedDispatch = {
    deleteForumPost: (props: IDeletePostProps) => void;
};

type CombinedProps = Props & ConnectedDispatch & ConnectedState;
class ForumPostComponent extends React.Component<CombinedProps> {
    public render() {
        const post = this.props.post;
        const author = this.props.author;
        const posted = getDateDiff({ past: post.createdAt });
        const onDelete = () => {
            this.props.deleteForumPost({
                thread: post.thread,
                post: post.id,
                currentPage: this.props.page
            });
        };
        return (
            <div>
                <div className="panel panel-default">
                    <div className="panel-heading" style={{ display: 'flex' }}>
                        <span style={{ flex: 'auto' }}>
                            <UserLink user={author} /> {posted}
                        </span>
                        <button className="btn btn-sm btn-danger" onClick={onDelete}>
                            <i className="fa fa-trash" style={{ fontSize: '14px' }} />
                        </button>
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

const mapDispatchToProps = (dispatch: redux.Dispatch<Store.All>): ConnectedDispatch => ({
    deleteForumPost: (props: IDeletePostProps) => dispatch(deleteForumPost(props))
});

const ForumPost: React.ComponentClass<Props> =
    connect(mapStateToProps, mapDispatchToProps)(ForumPostComponent);
export default ForumPost;