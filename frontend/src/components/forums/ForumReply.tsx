import * as React from 'react';
import * as redux from 'redux';
import { connect } from 'react-redux';

import Store from '../../store';
import Avatar from '../users/Avatar';
import IUser from '../../models/IUser';
import Editor, { IEditorHandle } from '../bbcode/Editor';
import { IForumThread } from '../../models/forums/IForumThread';
import { IForumPostUpdate } from '../../models/forums/IForumPost';
import { postReply } from '../../actions/forums/CreatePostAction';

export type Props = {
    thread: IForumThread;
};

type ConnectedState = {
    author: IUser;
};

type ConnectedDispatch = {
    postReply: (post: IForumPostUpdate) => void;
};

type CombinedProps = Props & ConnectedDispatch & ConnectedState;
class ForumReplyComponent extends React.Component<CombinedProps> {
    private _editorHandle: IEditorHandle;

    public render() {
        const onHandle = (handle: IEditorHandle) => { this._editorHandle = handle; };
        const onSave = () => {
            const content = this._editorHandle.getContent();
            this.props.postReply({
                thread: this.props.thread.id,
                body: content
            });
        };
        return (
            <div className="panel panel-primary">
                <div className="panel-heading" >
                    Post your reply
                </div>
                <div className="panel-body" style={{ display: 'flex' }}>
                    <Avatar />
                    <div style={{ flex: 'auto', marginLeft: '8px' }}>
                        <Editor content={''} size="small" receiveHandle={onHandle} />
                        <div style={{ display: 'flex', flexFlow: 'row-reverse' }}>
                            <button type="button" className="btn btn-sm btn-primary"
                                style={{ marginTop: '4px' }} onClick={onSave}>
                                Post reply
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state: Store.All, ownProps: Props): ConnectedState => {
    const author = state.sealed.users.byId[state.sealed.currentUser.id as number] as IUser;
    return {
        author: author
    };
};

const mapDispatchToProps = (dispatch: redux.Dispatch<Store.All>): ConnectedDispatch => ({
    postReply: (post: IForumPostUpdate) => dispatch(postReply(post))
});

const ForumReply: React.ComponentClass<Props> =
    connect(mapStateToProps, mapDispatchToProps)(ForumReplyComponent);
export default ForumReply;