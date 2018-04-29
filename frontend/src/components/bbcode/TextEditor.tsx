import * as React from 'react';

export interface ITextEditorHandle {
    getContent: () => string;
    injectTag: (tag: string, value?: string) => void;
    injectText: (text: string, cursor?: number) => void;
}

export type Props = {
    content: string;
    startingHeight: number;
    receiveHandle?: (handle: ITextEditorHandle) => void;
};

type State = {
    content: string;
};

export default class TextEditor extends React.Component<Props, State> {
    private _textArea: HTMLTextAreaElement;

    constructor(props: Props) {
        super(props);

        this.state = {
            content: ''
        };
    }

    public componentWillMount() {
        this.setState({ content: this.props.content });
    }

    public componentDidMount() {
        if (this.props.receiveHandle) {
            this.props.receiveHandle({
                getContent: () => {
                    return this.state.content;
                },
                injectTag: (tag: string, value?: string) => {
                    if (this._textArea) {
                        injectTag(this._textArea, tag, value);
                        this.setState({ content: this._textArea.value });
                    }
                },
                injectText: (text: string, cursor?: number) => {
                    if (this._textArea) {
                        injectText(this._textArea, text, cursor);
                        this.setState({ content: this._textArea.value });
                    }
                }
            });
        }
    }

    public componentWillReceiveProps(props: Props) {
        this.setState({ content: props.content });
    }

    public render() {
        return <textarea
            className="form-control"
            ref={(textarea: HTMLTextAreaElement) => this._textArea = textarea}
            style={{ height: `${this.props.startingHeight}px` }}
            spellCheck={true}
            value={this.state.content}
            onChange={this._handleChange.bind(this)}
        />;
    }

    private _handleChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
        this.setState({ content: event.target.value });
    }
}

function injectText(element: HTMLTextAreaElement, text: string, cursor?: number) {
    if (element.selectionStart || element.selectionStart === 0) {
        const original = element.value;
        const start = element.selectionStart;
        const end = element.selectionEnd;

        const newText = original.substring(0, start) + text + original.substring(end, original.length);
        element.value = newText;

        const newFocus = start + (cursor || 0);
        element.setSelectionRange(newFocus, newFocus);
        element.focus();
    } else {
        element.value += text;
        element.focus();
    }
}

function injectTag(element: HTMLTextAreaElement, tag: string, value?: string) {
    if (element.selectionStart || element.selectionStart === 0) {
        const text = element.value;
        const start = element.selectionStart;
        const end = element.selectionEnd;

        const selection = text.substring(start, end);
        const insertion = `[${tag}${value ? `=${value}` : ''}]${selection}[/${tag}]`;
        const newText = text.substring(0, start) + insertion + text.substring(end, text.length);
        element.value = newText;

        const insertionOffset = 1 + tag.length + (value ? 1 + value.length : 0) + 1;
        const newFocus = start + insertionOffset;
        element.setSelectionRange(newFocus, newFocus + end - start);
        element.focus();
    } else {
        element.value += tag;
        element.focus();
    }
}