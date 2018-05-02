import * as React from 'react';
import * as redux from 'redux';
import { connect } from 'react-redux';

import Store from '../store';
import Empty from '../components/Empty';
import TorrentsView from '../components/torrents/TorrentsView';
import { getTorrents } from '../actions/torrents/TorrentsAction';

export type Props = {
    params: {
        page: string;
    };
};

type ConnectedState = {
    page: number;
    loading: boolean;
    loaded: boolean;
    failed: boolean;
};

type ConnectedDispatch = {
    getTorrents: (page: number) => void;
};

type CombinedProps = ConnectedState & ConnectedDispatch & Props;
class TorrentsPage extends React.Component<CombinedProps> {
    public componentWillMount() {
        if (!this.props.loading) {
            this.props.getTorrents(this.props.page);
        }
    }

    public componentWillReceiveProps(props: CombinedProps) {
        const needPage = !props.loaded && !props.failed;
        const pageChanged = props.page !== this.props.page;
        if (!props.loading && (pageChanged || needPage)) {
            this.props.getTorrents(props.page);
        }
    }

    public render() {
        if (!this.props.loaded) {
            return <Empty loading={this.props.loading} />;
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
        loading: page ? page.loading : false,
        loaded: page ? page.loaded : false,
        failed: page ? page.failed : false
    };
};

const mapDispatchToProps = (dispatch: redux.Dispatch<Store.All>): ConnectedDispatch => ({
    getTorrents: (page: number) => dispatch(getTorrents(page))
});

export default connect(mapStateToProps, mapDispatchToProps)(TorrentsPage);
