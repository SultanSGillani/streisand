import * as React from 'react';
import * as redux from 'redux';
import { connect } from 'react-redux';

import Store from '../../store';
import Avatar from '../users/Avatar';
import IUser from '../../models/IUser';
import UserLink from '../links/UserLink';
import TextView from '../bbcode/TextView';
import { getItem } from '../../utilities/mapping';
import { getDateDiff } from '../../utilities/dates';
import { ScreenSize } from '../../models/IDeviceInfo';
import IForumPost from '../../models/forums/IForumPost';
import Editor, { IEditorHandle } from '../bbcode/Editor';
import { updatePost } from '../../actions/forums/posts/UpdatePostAction';
import { IDeletePostProps, deleteForumPost } from '../../actions/forums/posts/DeletePostAction';

export type Props = {
    page: number;
    post: IForumPost;
};

type State = {
    editMode: boolean;
};

type ConnectedState = {
    author?: IUser;
    modifiedBy?: IUser;
    screenSize: ScreenSize;
};
type ConnectedDispatch = {
    deleteForumPost: (props: IDeletePostProps) => void;
    updatePost: (id: number, content: string) => void;
};

type CombinedProps = Props & ConnectedDispatch & ConnectedState;
class ForumPostComponent extends React.Component<CombinedProps, State> {
    private _editorHandle: IEditorHandle;

    constructor(props: CombinedProps) {
        super(props);

        this.state = {
            editMode: false
        };
    }

    public render() {
        const { post, author, page } = this.props;
        const posted = getDateDiff({ past: post.createdAt });
        const onDelete = () => {
            this.props.deleteForumPost({
                thread: post.thread,
                post: post.id,
                currentPage: page
            });
        };

        const onEdit = () => { this.setState({ editMode: true }); };
        const onCancel = () => { this.setState({ editMode: false }); };
        const onHandle = (handle: IEditorHandle) => { this._editorHandle = handle; };
        const onSave = () => {
            this.props.updatePost(post.id, this._editorHandle.getContent());
            this.setState({ editMode: false });
        };

        if (this.state.editMode) {
            return (
                <div className="panel panel-primary">
                    <div className="panel-heading" style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ flex: 'auto' }}>
                            <UserLink user={author} /> {posted}
                        </span>
                    </div>
                    <div className="panel-body">
                        <Editor content={post.body} size="small" receiveHandle={onHandle} />
                    </div>
                    <div className="panel-footer">
                        <div className=" btn-toolbar" style={{ display: 'flex', flexFlow: 'row-reverse' }}>
                            <button type="button" className="btn btn-sm btn-primary" onClick={onSave}>
                                Update post
                            </button>
                            <button type="button" className="btn btn-sm btn-default" onClick={onCancel}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        const avatar = this.props.screenSize >= ScreenSize.medium ? <Avatar /> : undefined;
        return (
            <div className="panel panel-default">
                <div className="panel-heading" style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ flex: 'auto' }}>
                        <UserLink user={author} /> {posted}
                    </span>
                    <div className="btn-toolbar" style={{ flex: 'none' }}>
                        <button className="btn btn-sm btn-default" onClick={onEdit}>
                            <i className="fa fa-pencil" style={{ fontSize: '14px' }} />
                        </button>
                        <button className="btn btn-sm btn-danger" onClick={onDelete}>
                            <i className="fa fa-trash" style={{ fontSize: '14px' }} />
                        </button>
                    </div>
                </div>
                <div className="panel-body" style={{ display: 'flex' }}>
                    {avatar}
                    <div style={{ flex: 'auto', marginLeft: '8px' }}>
                        <TextView content={post.body || ''} />
                    </div>
                </div>
                {this._getStandardFooter()}
            </div>
        );
    }

    private _getStandardFooter() {
        let content;
        const { post, modifiedBy } = this.props;
        const modified = (post.modifiedAt && post.modifiedAt !== post.createdAt) ? getDateDiff({ past: post.modifiedAt }) : undefined;
        if (modifiedBy) {
            content = (<div>Modified by <UserLink user={modifiedBy} /> {modified}</div>);
        } else if (modified) {
            content = (<div>Modified {modified}</div>);
        }
        if (content) {
            return (
                <div className="panel-footer" style={{ display: 'flex', flexFlow: 'row-reverse' }}>
                    {content}
                </div>
            );
        }
    }
}

const mapStateToProps = (state: Store.All, ownProps: Props): ConnectedState => {
    return {
        screenSize: state.deviceInfo.screenSize,
        author: getItem({
            id: ownProps.post.author,
            byId: state.sealed.users.byId
        }),
        modifiedBy: getItem({
            id: ownProps.post.modifiedBy,
            byId: state.sealed.users.byId
        })
    };
};

const mapDispatchToProps = (dispatch: redux.Dispatch<Store.All>): ConnectedDispatch => ({
    deleteForumPost: (props: IDeletePostProps) => dispatch(deleteForumPost(props)),
    updatePost: (id: number, content: string) => dispatch(updatePost(id, content))
});

const ForumPost: React.ComponentClass<Props> =
    connect(mapStateToProps, mapDispatchToProps)(ForumPostComponent);
export default ForumPost;