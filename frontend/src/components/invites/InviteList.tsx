import * as React from 'react';
import { Table } from 'reactstrap';
import { connect } from 'react-redux';

import Pager from '../Pager';
import InviteRow from './InviteRow';
import Store from '../../state/store';
import IInvite from '../../models/IInvite';
import { ScreenSize } from '../../models/IDeviceInfo';
import { getNodeItems } from '../../utilities/mapping';

export type Props = {
    page: number;
};

type ConnectedState = {
    total: number;
    pageSize: number;
    invites: IInvite[];
    screenSize: ScreenSize;
};
type ConnectedDispatch = {};

type CombinedProps = Props & ConnectedDispatch & ConnectedState;
class InviteListComponent extends React.Component<CombinedProps> {
    public render() {
        const { invites, page, total, pageSize } = this.props;
        const pager = <Pager uri="/invites" total={total} page={page} pageSize={pageSize} />;
        const rows = invites.map((invite: IInvite) => {
            return (<InviteRow invite={invite} key={invite.key} page={page} />);
        });
        // const full = this.props.screenSize > ScreenSize.small || undefined;
        return (
            <div>
                {pager}
                <Table className="table-borderless" striped hover>
                    <thead>
                        <tr>
                            <th>Email</th>
                            <th>Key</th>
                            <th>Created</th>
                            <th colSpan={2}>Expires</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                </Table>
                {pager}
            </div>
        );
    }
}

const mapStateToProps = (state: Store.All, props: Props): ConnectedState => {
    const list = state.sealed.invite.list;
    return {
        total: list.count,
        pageSize: list.pageSize,
        screenSize: state.deviceInfo.screenSize,
        invites: getNodeItems({
            page: props.page,
            byId: state.sealed.invite.byId,
            pages: list.pages
        })
    };
};

const InviteList: React.ComponentClass<Props> =
    connect(mapStateToProps)(InviteListComponent);
export default InviteList;
