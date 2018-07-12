import * as React from 'react';
import { Button, ModalBody, Modal, ModalHeader, ModalFooter } from 'reactstrap';

import TextView from './TextView';
import Editor, { IEditorHandle } from './Editor';

export type Props = {
    text: string;
    title: string;
    isReadonly?: boolean;
    setValue: (value: string) => void;
};

type State = {
    isOpen: boolean;
};

export default class BBCodeModal extends React.Component<Props, State> {
    private _editorHandle: IEditorHandle;

    constructor(props: Props) {
        super(props);

        this.state = { isOpen: false };
    }

    public render() {
        const { title, text, isReadonly } = this.props;
        const onHandle = (handle: IEditorHandle) => { this._editorHandle = handle; };
        const toggle = () => {
            if (this.state.isOpen && this._editorHandle) {
                const content = this._editorHandle.getContent();
                this.props.setValue(content);
            }
            this.setState({ isOpen: !this.state.isOpen });
        };
        const buttonText = isReadonly ? 'View' : 'Edit';
        const bbcode = isReadonly ? <TextView content={text} /> :
            <Editor content={text} size="large" receiveHandle={onHandle} />;
        const onKeyPress = (event: React.KeyboardEvent<HTMLElement>) => {
            if (event && event.key === 'Enter') {
                event.stopPropagation();
                return false;
            }
        };
        return (
            <>
                <Button color="secondary" onClick={toggle}>{buttonText}</Button>
                <Modal size="lg" isOpen={this.state.isOpen} toggle={toggle} onKeyPress={onKeyPress}>
                    <ModalHeader toggle={toggle}>{title}</ModalHeader>
                    <ModalBody>
                        {bbcode}
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={toggle}>Close</Button>
                    </ModalFooter>
                </Modal>
            </>
        );
    }
}