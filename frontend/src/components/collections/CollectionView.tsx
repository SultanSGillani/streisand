import * as React from 'react';
import { connect } from 'react-redux';
import { FormGroup, Input } from 'reactstrap';

import TextView from '../bbcode/TextView';
import CollectionCommandBar from './CollectionCommandBar';
import ICollection, { ICollectionUpdate } from '../../models/ICollection';
import Editor, { IEditorHandle } from '../bbcode/Editor';
import { IDispatch } from '../../state/actions/ActionTypes';
import { updateCollection } from '../../state/collection/actions/UpdateCollectionAction';
import { IActionProps, deleteCollection } from '../../state/collection/actions/DeleteCollectionAction';

export type Props = {
    collection: ICollection;
};

type State = {
    title: string;
    editMode: boolean;
};

type ConnectedState = {};

type ConnectedDispatch = {
    deleteCollection: (props: IActionProps) => void;
    updateCollection: (id: number, collection: ICollectionUpdate) => void;
};

type CombinedProps = ConnectedState & ConnectedDispatch & Props;
class CollectionViewComponent extends React.Component<CombinedProps, State> {
    private _editorHandle: IEditorHandle;

    constructor(props: CombinedProps) {
        super(props);

        this.state = {
            editMode: false,
            title: props.collection ? props.collection.title : ''
        };
    }

    public render() {
        const collection = this.props.collection;
        const editMode = this.state.editMode;
        const operations = {
            onEdit: () => { this.setState({ editMode: true }); },
            onCancel: () => { this.setState({ editMode: false }); },
            onSave: () => {
                const content = this._editorHandle.getContent();
                this.props.updateCollection(collection.id, {
                    title: this.state.title,
                    description: content
                });
            },
            onDelete: () => {
                this.props.deleteCollection({ id: collection.id });
            }
        };

        if (editMode) {
            const onHandle = (handle: IEditorHandle) => { this._editorHandle = handle; };
            return (
                <div>
                    <CollectionCommandBar collection={collection} editMode={editMode} operations={operations} />
                    <FormGroup>
                        <Input type="text" placeholder="Collection title" value={this.state.title}
                            onChange={(event) => this.setState({ title: event.target.value })} />
                    </FormGroup>
                    <Editor content={collection.description} receiveHandle={onHandle} size="large" />
                </div>
            );
        }

        return (
            <div>
                <CollectionCommandBar collection={collection} editMode={editMode} operations={operations} />
                <h1>{collection.title}</h1>
                <TextView content={collection.description} />
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch: IDispatch): ConnectedDispatch => ({
    updateCollection: (id: number, collection: ICollectionUpdate) => dispatch(updateCollection(id, collection)),
    deleteCollection: (props: IActionProps) => dispatch(deleteCollection(props))
});

const CollectionView: React.ComponentClass<Props> =
    connect(undefined, mapDispatchToProps)(CollectionViewComponent);
export default CollectionView;
