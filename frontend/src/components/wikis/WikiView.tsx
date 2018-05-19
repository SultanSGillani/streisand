import * as React from 'react';
import * as redux from 'redux';
import { connect } from 'react-redux';
import { FormGroup, Input } from 'reactstrap';

import Store from '../../store';
import TextView from '../bbcode/TextView';
import WikiCommandBar from './WikiCommandBar';
import IWiki, { IWikiUpdate } from '../../models/IWiki';
import Editor, { IEditorHandle } from '../bbcode/Editor';
import { updateWiki } from '../../actions/wikis/UpdateWikiAction';
import { IDeleteProps, deleteWiki } from '../../actions/wikis/DeleteWikiAction';

export type Props = {
    wiki: IWiki;
};

type State = {
    title: string;
    editMode: boolean;
};

type ConnectedState = {};

type ConnectedDispatch = {
    deleteWiki: (props: IDeleteProps) => void;
    updateWiki: (id: number, wiki: IWikiUpdate) => void;
};

type CombinedProps = ConnectedState & ConnectedDispatch & Props;
class WikiViewComponent extends React.Component<CombinedProps, State> {
    private _editorHandle: IEditorHandle;

    constructor(props: CombinedProps) {
        super(props);

        this.state = {
            editMode: false,
            title: props.wiki ? props.wiki.title : ''
        };
    }

    public render() {
        const wiki = this.props.wiki;
        const editMode = this.state.editMode;
        const operations = {
            onEdit: () => { this.setState({ editMode: true }); },
            onCancel: () => { this.setState({ editMode: false }); },
            onSave: () => {
                const content = this._editorHandle.getContent();
                this.props.updateWiki(wiki.id, {
                    title: this.state.title,
                    body: content
                });
            },
            onDelete: () => {
                this.props.deleteWiki({ id: wiki.id });
            }
        };

        if (editMode) {
            const onHandle = (handle: IEditorHandle) => { this._editorHandle = handle; };
            return (
                <div>
                    <WikiCommandBar wiki={wiki} editMode={editMode} operations={operations} />
                    <FormGroup>
                        <Input type="text" placeholder="Wiki title" value={this.state.title}
                            onChange={(event) => this.setState({ title: event.target.value })} />
                    </FormGroup>
                    <Editor content={wiki.body} receiveHandle={onHandle} size="large" />
                </div>
            );
        }

        return (
            <div>
                <WikiCommandBar wiki={wiki} editMode={editMode} operations={operations} />
                <h1>{wiki.title}</h1>
                <TextView content={wiki.body} />
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch: redux.Dispatch<Store.All>): ConnectedDispatch => ({
    updateWiki: (id: number, wiki: IWikiUpdate) => dispatch(updateWiki(id, wiki)),
    deleteWiki: (props: IDeleteProps) => dispatch(deleteWiki(props))
});

const WikiView: React.ComponentClass<Props> =
    connect(undefined, mapDispatchToProps)(WikiViewComponent);
export default WikiView;