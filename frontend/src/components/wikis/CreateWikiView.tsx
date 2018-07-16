import * as React from 'react';
import { connect } from 'react-redux';
import { Input, FormGroup } from 'reactstrap';

import Store from '../../store';
import { IWikiUpdate } from '../../models/IWiki';
import CommandBar, { ICommand } from '../CommandBar';
import { IDispatch } from '../../state/actions/ActionTypes';
import Editor, { IEditorHandle } from '../bbcode/Editor';
import { createWiki } from '../../actions/wikis/CreateWikiAction';

export type Props = {};

type ConnectedState = {
    creating: boolean;
};
type ConnectedDispatch = {
    createWiki: (wiki: IWikiUpdate) => void;
};
type State = {
    title: string;
};

type CombinedProps = Props & ConnectedDispatch & ConnectedState;
class CreateWikiViewComponent extends React.Component<CombinedProps, State> {
    private _editorHandle: IEditorHandle;

    constructor(props: CombinedProps) {
        super(props);

        this.state = {
            title: 'New wiki'
        };
    }

    public render() {
        const onHandle = (handle: IEditorHandle) => { this._editorHandle = handle; };
        const onSave = () => {
            const content = this._editorHandle.getContent();
            this.props.createWiki({
                title: this.state.title,
                body: content
            });
        };
        const create: ICommand = this.props.creating
            ? { label: 'creating wiki...' }
            : { label: 'Save', onExecute: onSave };
        return (
            <div>
                <CommandBar commands={[create]} />
                <FormGroup>
                    <Input type="text" placeholder="Wiki title" value={this.state.title}
                        onChange={(event) => this.setState({ title: event.target.value })} />
                </FormGroup>
                <Editor content="" receiveHandle={onHandle} size="large" />
            </div>
        );
    }
}

const mapStateToProps = (state: Store.All, props: Props): ConnectedState => ({
    creating: state.sealed.wiki.creating
});

const mapDispatchToProps = (dispatch: IDispatch): ConnectedDispatch => ({
    createWiki: (wiki: IWikiUpdate) => dispatch(createWiki(wiki))
});

const CreateWikiView: React.ComponentClass<Props> =
    connect(mapStateToProps, mapDispatchToProps)(CreateWikiViewComponent);
export default CreateWikiView;
