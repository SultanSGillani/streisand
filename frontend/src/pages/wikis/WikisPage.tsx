import * as React from 'react';
import { connect } from 'react-redux';

import Store from '../../store';
import { IDispatch } from '../../state/actions/ActionTypes';
import { parsePageNumber } from '../../utilities/shim';
import Loading from '../../components/generic/Loading';
import WikisView from '../../components/wikis/WikisView';
import { getWikis } from '../../actions/wikis/WikisAction';
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
    getWikis: (page: number) => void;
};

type CombinedProps = ConnectedState & ConnectedDispatch & Props;
class WikisPage extends React.Component<CombinedProps> {
    public componentWillMount() {
        if (!this.props.status.loading) {
            this.props.getWikis(this.props.page);
        }
    }

    public componentWillReceiveProps(props: CombinedProps) {
        const status = props.status;
        const needPage = !status.failed && (!status.loaded || status.outdated);
        const pageChanged = props.page !== this.props.page;
        if (!status.loading && (pageChanged || needPage)) {
            this.props.getWikis(props.page);
        }
    }

    public render() {
        if (!this.props.status.loaded) {
            return <Loading />;
        }

        return (
            <WikisView page={this.props.page} />
        );
    }
}

const mapStateToProps = (state: Store.All, props: Props): ConnectedState => {
    const pageNumber = parsePageNumber(props.params && props.params.page);
    const page = state.sealed.wiki.list.pages[pageNumber];
    return {
        page: pageNumber,
        status: page ? page.status : defaultStatus
    };
};

const mapDispatchToProps = (dispatch: IDispatch): ConnectedDispatch => ({
    getWikis: (page: number) => dispatch(getWikis(page))
});

export default connect(mapStateToProps, mapDispatchToProps)(WikisPage);
