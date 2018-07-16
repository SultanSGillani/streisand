import * as React from 'react';
import { Card, CardBody } from 'reactstrap';

import TextView from './TextView';
import EditorCommandBar from './commands/EditorCommandBar';
import TextEditor, { ITextEditorHandle } from './TextEditor';

export interface IEditorHandle {
    focusEditor: () => void;
    getContent: () => string;
}

export type Props = {
    content?: string;
    size: 'small' | 'large';
    receiveHandle?: (handle: IEditorHandle) => void;
};

type State = {
    content: string;
    preview: boolean;
};

export default class Editor extends React.Component<Props, State> {
    private _textEditor: ITextEditorHandle;

    constructor(props: Props) {
        super(props);

        this.state = {
            content: '',
            preview: false
        };
    }

    public componentWillMount() {
        this.setState({ content: this.props.content || '' });
    }

    public componentDidMount() {
        if (this.props.receiveHandle) {
            this.props.receiveHandle({
                focusEditor: () => {
                    if (!this.state.preview && this._textEditor) {
                        return this._textEditor.focusEditor();
                    }
                },
                getContent: () => {
                    if (!this.state.preview && this._textEditor) {
                        return this._textEditor.getContent();
                    }
                    return this.state.content;
                }
            });
        }
    }

    public componentWillReceiveProps(props: Props) {
        const newContent = props.content || '';
        if (newContent !== this.props.content) {
            this.setState({
                content: newContent,
                preview: false
            });
        }
    }

    public render() {
        const props = this.props;
        const state = this.state;

        const commandbar = <EditorCommandBar
            isPreview={state.preview}
            toggleMode={() => this.setState({ preview: !state.preview })}
            getHandle={() => this._textEditor}
            commitContent={(content: string) => this.setState({ content: content })}
        />;
        if (state.preview) {
            return (
                <div>
                    {commandbar}
                    <Card className="my-2">
                        <CardBody className="p-2">
                        <TextView content={state.content} />
                        </CardBody>
                    </Card>
                </div>
            );
        }

        const onHandle = (handle: ITextEditorHandle) => {
            this._textEditor = handle;
        };

        return (
            <div>
                {commandbar}
                <TextEditor
                    content={state.content}
                    startingHeight={props.size === 'large' ? 500 : 250}
                    receiveHandle={onHandle} />
            </div>
        );
    }
}