import * as React from 'react';

import IWiki from '../../models/IWiki';
import CommandBar, { ICommand } from '../CommandBar';

export type Props = {
    wiki: IWiki;
    editMode: boolean;
    operations: {
        onEdit: () => void;
        onCancel: () => void;
        onSave: () => void;
        onDelete: () => void;
    }
};

export default class WikiCommandBar extends React.Component<Props> {
    public render() {
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
                onExecute: () => { operations.onDelete(); }
            });
        }
        return <CommandBar commands={commands} />;
    }
}