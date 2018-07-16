import * as React from 'react';
import { connect } from 'react-redux';

import Store from '../store';
import { IDispatch } from '../state/actions/ActionTypes';
import { parsePageNumber } from '../utilities/shim';
import ILoadingStatus, { defaultStatus } from '../models/base/ILoadingStatus';
import DetachedTorrentsView from '../components/torrents/DetachedTorrentsView';
import { getDetachedTorrents } from '../actions/torrents/DetachedTorrentsAction';

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
    getItems: (page: number) => void;
};

type CombinedProps = ConnectedState & ConnectedDispatch & Props;
class DetachedTorrentsPage extends React.Component<CombinedProps> {
    public componentWillMount() {
        if (!this.props.status.loading) {
            this.props.getItems(this.props.page);
        }
    }

    public componentWillReceiveProps(props: CombinedProps) {
        const status = props.status;
        const needPage = !status.failed && (!status.loaded || status.outdated);
        const pageChanged = props.page !== this.props.page;
        if (!status.loading && (pageChanged || needPage)) {
            this.props.getItems(props.page);
        }
    }

    public render() {
        return (
            <DetachedTorrentsView page={this.props.page} />
        );
    }
}

const mapStateToProps = (state: Store.All, props: Props): ConnectedState => {
    const pageNumber = parsePageNumber(props.params && props.params.page);
    const page = state.sealed.torrent.detached.pages[pageNumber];
    return {
        page: pageNumber,
        status: page ? page.status : defaultStatus
    };
};

const mapDispatchToProps = (dispatch: IDispatch): ConnectedDispatch => ({
    getItems: (page: number) => dispatch(getDetachedTorrents(page))
});

export default connect(mapStateToProps, mapDispatchToProps)(DetachedTorrentsPage);
