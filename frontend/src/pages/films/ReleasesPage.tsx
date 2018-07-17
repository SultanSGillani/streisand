import * as React from 'react';
import { connect } from 'react-redux';

import Store from '../../state/store';
import { parsePageNumber } from '../../utilities/shim';
import { IDispatch } from '../../state/actions/ActionTypes';
import ReleaseList from '../../components/releases/ReleaseList';
import { getReleases } from '../../state/release/actions/ReleasesAction';
import ILoadingStatus, { defaultStatus } from '../../models/base/ILoadingStatus';

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
    getRleases: (page: number) => void;
};

type CombinedProps = ConnectedState & ConnectedDispatch & Props;
class ReleasesPage extends React.Component<CombinedProps> {
    public componentWillMount() {
        if (!this.props.status.loading) {
            this.props.getRleases(this.props.page);
        }
    }

    public componentWillReceiveProps(props: CombinedProps) {
        const status = props.status;
        const needPage = !status.failed && (!status.loaded || status.outdated);
        const pageChanged = props.page !== this.props.page;
        if (!status.loading && (pageChanged || needPage)) {
            this.props.getRleases(props.page);
        }
    }

    public render() {
        return (
            <ReleaseList page={this.props.page} />
        );
    }
}

const mapStateToProps = (state: Store.All, props: Props): ConnectedState => {
    const pageNumber = parsePageNumber(props.params && props.params.page);
    const page = state.sealed.release.list.pages[pageNumber];
    return {
        page: pageNumber,
        status: page ? page.status : defaultStatus
    };
};

const mapDispatchToProps = (dispatch: IDispatch): ConnectedDispatch => ({
    getRleases: (page: number) => dispatch(getReleases(page))
});

export default connect(mapStateToProps, mapDispatchToProps)(ReleasesPage);
