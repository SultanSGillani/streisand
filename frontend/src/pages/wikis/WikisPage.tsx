import * as React from 'react';
import * as redux from 'redux';
import { connect } from 'react-redux';

import Store from '../../store';
import Empty from '../../components/Empty';
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
            return <Empty loading={this.props.status.loading} />;
        }

        return (
            <WikisView page={this.props.page} />
        );
    }
}

const mapStateToProps = (state: Store.All, ownProps: Props): ConnectedState => {
    const pageNumber = Number((ownProps.params && ownProps.params.page) || 1);
    const page = state.sealed.wikis.pages[pageNumber];
    return {
        page: pageNumber,
        status: page ? page.status : defaultStatus
    };
};

const mapDispatchToProps = (dispatch: redux.Dispatch<Store.All>): ConnectedDispatch => ({
    getWikis: (page: number) => dispatch(getWikis(page))
});

export default connect(mapStateToProps, mapDispatchToProps)(WikisPage);
