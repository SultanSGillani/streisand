import * as React from 'react';
import * as redux from 'redux';
import { connect } from 'react-redux';

import Store from '../../store';
import CommandBar, { ICommand } from '../CommandBar';
import Editor, { IEditorHandle } from '../bbcode/Editor';
import { IWikiUpdate } from '../../models/IWiki';
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
                <div className="form-group">
                    <input type="text" className="form-control" placeholder="Wiki title"
                        value={this.state.title} onChange={(event) => this.setState({ title: event.target.value })} />
                </div>
                <Editor content="" receiveHandle={onHandle} size="large" />
            </div>
        );
    }
}

const mapStateToProps = (state: Store.All, ownProps: Props): ConnectedState => ({
    creating: state.sealed.wikis.creating
});

const mapDispatchToProps = (dispatch: redux.Dispatch<Store.All>): ConnectedDispatch => ({
    createWiki: (wiki: IWikiUpdate) => dispatch(createWiki(wiki))
});

const CreateWikiView: React.ComponentClass<Props> =
    connect(mapStateToProps, mapDispatchToProps)(CreateWikiViewComponent);
export default CreateWikiView;
