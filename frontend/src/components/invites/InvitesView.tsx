import * as React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import InviteList from './InviteList';
import CommandBar, { ICommand } from '../CommandBar';
import { IDispatch } from '../../state/actions/ActionTypes';

export type Props = {
    page: number;
};

type ConnectedState = {};
type ConnectedDispatch = {
    sendInvite: () => void;
};

type CombinedProps = Props & ConnectedDispatch & ConnectedState;
class WikisViewComponent extends React.Component<CombinedProps> {
    public render() {
        const commands: ICommand[] = [{
            label: 'Send new invite',
            onExecute: () => { this.props.sendInvite(); }
        }];
        return (
            <div>
                <CommandBar commands={commands} />
                <InviteList page={this.props.page} />
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch: IDispatch): ConnectedDispatch => ({
    sendInvite: () => dispatch(push('/invites/create'))
});
const InvitesView: React.ComponentClass<Props> =
    connect(undefined, mapDispatchToProps)(WikisViewComponent);
export default InvitesView;
