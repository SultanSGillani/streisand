import * as React from 'react';
import { connect } from 'react-redux';

import Store from '../store';
import Empty from '../components/Empty';
import { IDispatch } from '../actions/ActionTypes';
import TorrentsView from '../components/torrents/TorrentsView';
import { getTorrents } from '../actions/torrents/TorrentsAction';
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
    getTorrents: (page: number) => void;
};

type CombinedProps = ConnectedState & ConnectedDispatch & Props;
class TorrentsPage extends React.Component<CombinedProps> {
    public componentWillMount() {
        if (!this.props.status.loading) {
            this.props.getTorrents(this.props.page);
        }
    }

    public componentWillReceiveProps(props: CombinedProps) {
        const status = props.status;
        const needPage = !status.failed && (!status.loaded || status.outdated);
        const pageChanged = props.page !== this.props.page;
        if (!status.loading && (pageChanged || needPage)) {
            this.props.getTorrents(props.page);
        }
    }

    public render() {
        if (!this.props.status.loaded) {
            return <Empty loading={this.props.status.loading} />;
        }

        return (
            <TorrentsView page={this.props.page} />
        );
    }
}

const mapStateToProps = (state: Store.All, ownProps: Props): ConnectedState => {
    const pageNumber = Number((ownProps.params && ownProps.params.page) || 1);
    const page = state.sealed.torrents.pages[pageNumber];
    return {
        page: pageNumber,
        status: page ? page.status : defaultStatus
    };
};

const mapDispatchToProps = (dispatch: IDispatch): ConnectedDispatch => ({
    getTorrents: (page: number) => dispatch(getTorrents(page))
});

export default connect(mapStateToProps, mapDispatchToProps)(TorrentsPage);
