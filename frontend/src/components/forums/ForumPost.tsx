import * as React from 'react';
import { connect } from 'react-redux';
import { Card, CardBody, CardHeader, Button, ButtonGroup, CardFooter } from 'reactstrap';

import Store from '../../store';
import Avatar from '../users/Avatar';
import IUser from '../../models/IUser';
import UserLink from '../links/UserLink';
import TextView from '../bbcode/TextView';
import AwesomeIcon from '../generic/AwesomeIcon';
import TimeElapsed from '../generic/TimeElapsed';
import { getItem } from '../../utilities/mapping';
import { ScreenSize } from '../../models/IDeviceInfo';
import { IDispatch } from '../../actions/ActionTypes';
import IForumPost from '../../models/forums/IForumPost';
import Editor, { IEditorHandle } from '../bbcode/Editor';
import { updatePost } from '../../actions/forums/posts/UpdatePostAction';
import { IActionProps, deleteForumPost } from '../../actions/forums/posts/DeletePostAction';

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
    deleteForumPost: (props: IActionProps) => void;
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
                <Card className="border-primary mb-2">
                    <CardHeader>
                        <UserLink user={author} /> <TimeElapsed date={post.createdAt} />
                    </CardHeader>
                    <CardBody>
                        <Editor content={post.body} size="small" receiveHandle={onHandle} />
                    </CardBody>
                    <CardFooter>
                        <div className="row m-0 justify-content-end">
                            <ButtonGroup>
                                <Button onClick={onCancel}>Cancel</Button>
                                <Button color="primary" onClick={onSave}>Update post</Button>
                            </ButtonGroup>
                        </div>
                    </CardFooter>
                </Card >
            );
        }

        const avatar = this.props.screenSize < ScreenSize.medium ? undefined :
            <div className="col-auto"><Avatar user={author} /></div>;
        return (
            <Card className="mb-2">
                <CardHeader>
                    <div className="row">
                        <div className="col-auto">
                            <UserLink user={author} /> <TimeElapsed date={post.createdAt} />
                        </div>
                        <div className="col-auto ml-auto">
                            <ButtonGroup color="default" size="sm">
                                <Button onClick={onEdit}>
                                    <AwesomeIcon type="pencil-alt" size="lg" />
                                </Button>
                                <Button color="danger" onClick={onDelete}>
                                    <AwesomeIcon type="trash" size="lg" />
                                </Button>
                            </ButtonGroup>
                        </div>
                    </div>
                </CardHeader>
                <CardBody>
                    <div className="row">
                        {avatar}
                        <div className="col">
                            <TextView content={post.body || ''} />
                        </div>
                    </div>
                </CardBody>
                {this._getStandardFooter()}
            </Card >
        );
    }

    private _getStandardFooter() {
        let content;
        const { post, modifiedBy } = this.props;
        const modified = (post.modifiedAt && post.modifiedAt !== post.createdAt) ? <TimeElapsed date={ post.modifiedAt } /> : undefined;
        if (modifiedBy) {
            content = (<div>Modified by <UserLink user={modifiedBy} /> {modified}</div>);
        } else if (modified) {
            content = (<div>Modified {modified}</div>);
        }
        if (content) {
            return (
                <CardFooter>
                    <div className="row m-0 justify-content-end">
                        {content}
                    </div>
                </CardFooter>
            );
        }
    }
}

const mapStateToProps = (state: Store.All, props: Props): ConnectedState => {
    return {
        screenSize: state.deviceInfo.screenSize,
        author: getItem({
            fallback: true,
            id: props.post.author,
            byId: state.sealed.user.byId
        }),
        modifiedBy: getItem({
            fallback: true,
            id: props.post.modifiedBy,
            byId: state.sealed.user.byId
        })
    };
};

const mapDispatchToProps = (dispatch: IDispatch): ConnectedDispatch => ({
    deleteForumPost: (props: IActionProps) => dispatch(deleteForumPost(props)),
    updatePost: (id: number, content: string) => dispatch(updatePost(id, content))
});

const ForumPost: React.ComponentClass<Props> =
    connect(mapStateToProps, mapDispatchToProps)(ForumPostComponent);
export default ForumPost;