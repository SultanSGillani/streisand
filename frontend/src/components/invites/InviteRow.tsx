import * as React from 'react';
import { connect } from 'react-redux';

import Store from '../../state/store';
import IInvite from '../../models/IInvite';
import DeleteCell from '../generic/DeleteCell';
import TimeElapsed from '../generic/TimeElapsed';
import { ScreenSize } from '../../models/IDeviceInfo';
import { IDispatch } from '../../state/actions/ActionTypes';
import { IActionProps, deleteInvite } from '../../state/invite/actions/DeleteInviteAction';

export type Props = {
    invite: IInvite;
    page: number;
};

type ConnectedState = {
    screenSize: ScreenSize;
};

type ConnectedDispatch = {
    deleteInvite: (props: IActionProps) => void;
};

type CombinedProps = Props & ConnectedDispatch & ConnectedState;
class InviteRowComponent extends React.Component<CombinedProps> {
    public render() {
        const invite = this.props.invite;
        const onDelete = () => {
            this.props.deleteInvite({
                id: invite.key,
                currentPage: this.props.page
            });
        };
        // const full = this.props.screenSize > ScreenSize.small || undefined;
        return (
            <tr>
                <td className="align-middle">{invite.email}</td>
                <td className="align-middle">{invite.key}</td>
                <td className="align-middle"><TimeElapsed date={invite.createdAt} /></td>
                <td className="align-middle">{invite.expiresAt}</td>
                <DeleteCell onDelete={onDelete} />
            </tr>
        );
    }
}

const mapStateToProps = (state: Store.All): ConnectedState => ({
    screenSize: state.deviceInfo.screenSize
});

const mapDispatchToProps = (dispatch: IDispatch): ConnectedDispatch => ({
    deleteInvite: (props: IActionProps) => dispatch(deleteInvite(props))
});

const InviteRow: React.ComponentClass<Props> =
    connect(mapStateToProps, mapDispatchToProps)(InviteRowComponent);
export default InviteRow;