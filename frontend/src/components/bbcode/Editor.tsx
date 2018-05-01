import * as React from 'react';

import TextView from './TextView';
import EditorCommandBar from './commands/EditorCommandBar';
import TextEditor, { ITextEditorHandle } from './TextEditor';

export interface IEditorHandle {
    getContent: () => string;
}

export type Props = {
    content: string;
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
        this.setState({ content: this.props.content });
    }

    public componentDidMount() {
        if (this.props.receiveHandle) {
            this.props.receiveHandle({
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
        if (props.content !== this.props.content) {
            this.setState({
                content: props.content,
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
                    <div className="well well-sm">
                        <TextView content={state.content} />
                    </div>
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

// function FakeForumPost(props: Props) {
//     return (
//         <div className="panel panel-default">
//             <div className="panel-heading">
//             </div>
//             <div className="panel-body" style={{ display: 'flex' }}>
//                 <div>
//                     <img src="https://i.imgur.com/XxlIwUj.jpg" width="150" />
//                 </div>
//                 <div style={{ flex: 'auto', 'margin-left': '8px' }}>
//                     <CommandBar />
//                     <TextEditor
//                         content={props.content}
//                         startingHeight={400}
//                         receiveHandle={props.receiveHandle} />
//                 </div>
//             </div>
//         </div>
//     );
// }