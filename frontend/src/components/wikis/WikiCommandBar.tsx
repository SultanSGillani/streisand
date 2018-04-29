import * as React from 'react';
import * as redux from 'redux';
import { connect } from 'react-redux';

import Store from '../../store';
import IWiki from '../../models/IWiki';
import CommandBar, { ICommand } from '../CommandBar';
import { removeWiki } from '../../actions/wikis/RemoveWikiAction';

export type Props = {
    wiki: IWiki;
    editMode: boolean;
    operations: {
        onEdit: () => void;
        onCancel: () => void;
        onSave: () => void;
    }
};

type ConnectedState = { };

type ConnectedDispatch = {
    removeWiki: (id: number) => void;
};

type CombinedProps = ConnectedState & ConnectedDispatch & Props;
class WikiCommandBarComponent extends React.Component<CombinedProps, void> {
    public render() {
        const wiki = this.props.wiki;
        const operations = this.props.operations;
        const commands: ICommand[] = [];
        if (this.props.editMode) {
            commands.push({
                label: 'Save',
                onExecute: () => { operations.onSave(); }
            });
            commands.push({
                label: 'Cancel',
                onExecute: () => { operations.onCancel(); }
            });
        } else {
            commands.push({
                label: 'Edit',
                onExecute: () => { operations.onEdit(); }
            });
            commands.push({
                label: 'Delete',
                status: 'danger',
                onExecute: () => { this.props.removeWiki(wiki.id); }
            });
        }
        return <CommandBar commands={commands} />;
    }
}

const mapDispatchToProps = (dispatch: redux.Dispatch<Store.All>): ConnectedDispatch => ({
    removeWiki: (id: number) => dispatch(removeWiki(id))
});

const WikiCommandBar: React.ComponentClass<Props> =
    connect(undefined, mapDispatchToProps)(WikiCommandBarComponent);
export default WikiCommandBar;
