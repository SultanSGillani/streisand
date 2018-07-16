import * as React from 'react';
import { Card, CardBody, CardTitle, Button, CardFooter } from 'reactstrap';

import IUser from '../../models/IUser';
import Editor, { IEditorHandle } from '../bbcode/Editor';

export interface INewPostProps {
    title: string;
    author?: IUser;
    saveText: string;
    createPost: (content: string) => void;
}

export default class NewPost extends React.Component<INewPostProps> {
    private _editorHandle: IEditorHandle;

    public render() {
        const onHandle = (handle: IEditorHandle) => { this._editorHandle = handle; };
        const onSave = () => this.props.createPost(this._editorHandle.getContent());
        return (
            <Card className="border-primary mb-3">
                <CardBody>
                    <CardTitle>{this.props.title}</CardTitle>
                    <Editor content={''} size="small" receiveHandle={onHandle} />
                </CardBody>
                <CardFooter>
                    <div className="row m-0 justify-content-end">
                        <Button className="col-auto" color="primary" onClick={onSave}>
                            {this.props.saveText}
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        );
    }
}