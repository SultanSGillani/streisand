import * as React from 'react';
import { Card, CardBody, CardHeader, Button, ButtonGroup, CardFooter } from 'reactstrap';

import Avatar from '../users/Avatar';
import IUser from '../../models/IUser';
import UserLink from '../links/UserLink';
import TextView from '../bbcode/TextView';
import TimeElapsed from './TimeElapsed';
import { IUserPost } from '../../models/IUserPost';
import { ScreenSize } from '../../models/IDeviceInfo';
import Editor, { IEditorHandle } from '../bbcode/Editor';
import AwesomeIcon from './AwesomeIcon';

export type Props = {
    author?: IUser;
    post: IUserPost;
    modifiedBy?: IUser;
    screenSize: ScreenSize;
    deletePost: () => void;
    updatePost: (content: string) => void;
};

type State = {
    editMode: boolean;
};

export default class UserPost extends React.Component<Props, State> {
    private _editorHandle: IEditorHandle;

    constructor(props: Props) {
        super(props);

        this.state = {
            editMode: false
        };
    }

    public render() {
        const { post, author } = this.props;
        const onDelete = () => this.props.deletePost();

        const onEdit = () => this.setState({ editMode: true });
        const onCancel = () => this.setState({ editMode: false });
        const onHandle = (handle: IEditorHandle) => {
            handle.focusEditor();
            this._editorHandle = handle;
        };
        const onSave = () => {
            this.props.updatePost(this._editorHandle.getContent());
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
        const modified = (post.modifiedAt && post.modifiedAt !== post.createdAt) ? <TimeElapsed date={post.modifiedAt} /> : undefined;
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