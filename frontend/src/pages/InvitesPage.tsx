import * as React from 'react';
import { connect } from 'react-redux';

import Store from '../store';
import { IDispatch } from '../state/actions/ActionTypes';
import { parsePageNumber } from '../utilities/shim';
import Loading from '../components/generic/Loading';
import InvitesView from '../components/invites/InvitesView';
import { getInvites } from '../actions/invites/InvitesAction';
import ILoadingStatus, { defaultStatus } from '../models/base/ILoadingStatus';

export type Props = {
    params: {
        page: string;
    };
};

type ConnectedState = {
    page: number;
    status: ILoadingStatus;
};

type ConnectedDispatch = {
    getInvites: (page: number) => void;
};

type CombinedProps = ConnectedState & ConnectedDispatch & Props;
class InvitesPage extends React.Component<CombinedProps> {
    public componentWillMount() {
        if (!this.props.status.loading) {
            this.props.getInvites(this.props.page);
        }
    }

    public componentWillReceiveProps(props: CombinedProps) {
        const status = props.status;
        const needPage = !status.failed && (!status.loaded || status.outdated);
        const pageChanged = props.page !== this.props.page;
        if (!status.loading && (pageChanged || needPage)) {
            this.props.getInvites(props.page);
        }
    }

    public render() {
        if (!this.props.status.loaded) {
            return <Loading />;
        }

        return (
            <InvitesView page={this.props.page} />
        );
    }
}

const mapStateToProps = (state: Store.All, props: Props): ConnectedState => {
    const pageNumber = parsePageNumber(props.params && props.params.page);
    const page = state.sealed.invite.list.pages[pageNumber];
    return {
        page: pageNumber,
        status: page ? page.status : defaultStatus
    };
};

const mapDispatchToProps = (dispatch: IDispatch): ConnectedDispatch => ({
    getInvites: (page: number) => dispatch(getInvites(page))
});

export default connect(mapStateToProps, mapDispatchToProps)(InvitesPage);
