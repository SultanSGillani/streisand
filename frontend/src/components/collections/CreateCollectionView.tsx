import * as React from 'react';
import { connect } from 'react-redux';
import { Input, FormGroup } from 'reactstrap';

import Store from '../../state/store';
import { ICollectionUpdate } from '../../models/ICollection';
import CommandBar, { ICommand } from '../CommandBar';
import Editor, { IEditorHandle } from '../bbcode/Editor';
import { IDispatch } from '../../state/actions/ActionTypes';
import { createCollection } from '../../state/collection/actions/CreateCollectionAction';

export type Props = {};

type ConnectedState = {
    creating: boolean;
};
type ConnectedDispatch = {
    createCollection: (collection: ICollectionUpdate) => void;
};
type State = {
    title: string;
};

type CombinedProps = Props & ConnectedDispatch & ConnectedState;
class CreateCollectionViewComponent extends React.Component<CombinedProps, State> {
    private _editorHandle: IEditorHandle;

    constructor(props: CombinedProps) {
        super(props);

        this.state = {
            title: 'New collection'
        };
    }

    public render() {
        const onHandle = (handle: IEditorHandle) => { this._editorHandle = handle; };
        const onSave = () => {
            const content = this._editorHandle.getContent();
            this.props.createCollection({
                title: this.state.title,
                description: content
            });
        };
        const create: ICommand = this.props.creating
            ? { label: 'creating collection...' }
            : { label: 'Save', onExecute: onSave };
        return (
            <div>
                <CommandBar commands={[create]} />
                <FormGroup>
                    <Input type="text" placeholder="Collection title" value={this.state.title}
                        onChange={(event) => this.setState({ title: event.target.value })} />
                </FormGroup>
                <Editor content="" receiveHandle={onHandle} size="large" />
            </div>
        );
    }
}

const mapStateToProps = (state: Store.All, props: Props): ConnectedState => ({
    creating: state.sealed.collection.creating
});

const mapDispatchToProps = (dispatch: IDispatch): ConnectedDispatch => ({
    createCollection: (collection: ICollectionUpdate) => dispatch(createCollection(collection))
});

const CreateCollectionView: React.ComponentClass<Props> =
    connect(mapStateToProps, mapDispatchToProps)(CreateCollectionViewComponent);
export default CreateCollectionView;
