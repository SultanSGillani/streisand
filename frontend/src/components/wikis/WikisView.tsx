import * as React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import WikiList from './WikiList';
import CommandBar, { ICommand } from '../CommandBar';
import { IDispatch } from '../../state/actions/ActionTypes';

export type Props = {
    page: number;
};

type ConnectedState = {};
type ConnectedDispatch = {
    createWiki: () => void;
};

type CombinedProps = Props & ConnectedDispatch & ConnectedState;
class WikisViewComponent extends React.Component<CombinedProps> {
    public render() {
        const commands: ICommand[] = [{
            label: 'Create new wiki',
            onExecute: () => { this.props.createWiki(); }
        }];
        return (
            <div>
                <CommandBar commands={commands} />
                <WikiList page={this.props.page} />
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch: IDispatch): ConnectedDispatch => ({
    createWiki: () => dispatch(push('/wikis/create'))
});
const WikisView: React.ComponentClass<Props> =
    connect(undefined, mapDispatchToProps)(WikisViewComponent);
export default WikisView;
