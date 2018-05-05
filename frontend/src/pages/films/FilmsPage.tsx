import * as React from 'react';
import * as redux from 'redux';
import { connect } from 'react-redux';

import Store from '../../store';
import Empty from '../../components/Empty';
import FilmsView from '../../components/films/FilmsView';
import { getFilms } from '../../actions/films/FilmsAction';
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
    getFilms: (page: number) => void;
};

type CombinedProps = ConnectedState & ConnectedDispatch & Props;
class FilmsPage extends React.Component<CombinedProps> {
    public componentWillMount() {
        if (!this.props.status.loading) {
            this.props.getFilms(this.props.page);
        }
    }

    public componentWillReceiveProps(props: CombinedProps) {
        const status = props.status;
        const needPage = !status.failed && (!status.loaded || status.outdated);
        const pageChanged = props.page !== this.props.page;
        if (!status.loading && (pageChanged || needPage)) {
            this.props.getFilms(props.page);
        }
    }

    public render() {
        if (!this.props.status.loaded) {
            return <Empty loading={this.props.status.loading} />;
        }

        return (
            <FilmsView page={this.props.page} />
        );
    }
}

const mapStateToProps = (state: Store.All, ownProps: Props): ConnectedState => {
    const pageNumber = Number((ownProps.params && ownProps.params.page) || 1);
    const page = state.sealed.films.pages[pageNumber];
    return {
        page: pageNumber,
        status: page ? page.status : defaultStatus
    };
};

const mapDispatchToProps = (dispatch: redux.Dispatch<Store.All>): ConnectedDispatch => ({
    getFilms: (page: number) => dispatch(getFilms(page))
});

export default connect(mapStateToProps, mapDispatchToProps)(FilmsPage);
