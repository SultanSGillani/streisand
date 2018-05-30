import * as React from 'react';
import { connect } from 'react-redux';
import { Card, CardBody, CardTitle, Button, CardFooter } from 'reactstrap';

import Store from '../../store';
import IUser from '../../models/IUser';
import { getItem } from '../../utilities/mapping';
import { IDispatch } from '../../actions/ActionTypes';
import Editor, { IEditorHandle } from '../bbcode/Editor';
import { IForumThread } from '../../models/forums/IForumThread';
import { IForumPostUpdate } from '../../models/forums/IForumPost';
import { postReply } from '../../actions/forums/posts/CreatePostAction';

export type Props = {
    thread: IForumThread;
};

type ConnectedState = {
    author?: IUser;
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
            <Card color="primary" className="mb-3">
                <CardBody>
                    <CardTitle>Post your reply</CardTitle>
                    <Editor content={''} size="small" receiveHandle={onHandle} />
                </CardBody>
                <CardFooter>
                    <div className="row m-0 justify-content-end">
                        <Button className="col-auto" color="primary" onClick={onSave}>Post reply</Button>
                    </div>
                </CardFooter>
            </Card>
        );
    }
}

const mapStateToProps = (state: Store.All, props: Props): ConnectedState => {
    return {
        author: getItem({
            id: state.sealed.currentUser.id,
            byId: state.sealed.user.byId
        })
    };
};

const mapDispatchToProps = (dispatch: IDispatch): ConnectedDispatch => ({
    postReply: (post: IForumPostUpdate) => dispatch(postReply(post))
});

const ForumReply: React.ComponentClass<Props> =
    connect(mapStateToProps, mapDispatchToProps)(ForumReplyComponent);
export default ForumReply;