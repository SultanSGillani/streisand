import * as React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import CollectionList from './CollectionList';
import CommandBar, { ICommand } from '../CommandBar';
import { IDispatch } from '../../state/actions/ActionTypes';

export type Props = {
    page: number;
};

type ConnectedState = {};
type ConnectedDispatch = {
    createCollection: () => void;
};

type CombinedProps = Props & ConnectedDispatch & ConnectedState;
class CollectionsViewComponent extends React.Component<CombinedProps> {
    public render() {
        const commands: ICommand[] = [{
            label: 'Create new collection',
            onExecute: () => { this.props.createCollection(); }
        }];
        return (
            <div>
                <CommandBar commands={commands} />
                <CollectionList page={this.props.page} />
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch: IDispatch): ConnectedDispatch => ({
    createCollection: () => dispatch(push('/collection/create'))
});
const CollectionsView: React.ComponentClass<Props> =
    connect(undefined, mapDispatchToProps)(CollectionsViewComponent);
export default CollectionsView;
