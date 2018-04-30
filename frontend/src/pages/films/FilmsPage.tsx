import * as React from 'react';
import * as redux from 'redux';
import { connect } from 'react-redux';

import Store from '../../store';
import Empty from '../../components/Empty';
import FilmsView from '../../components/films/FilmsView';
import { getFilms } from '../../actions/films/FilmsAction';

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
    getFilms: (page: number) => void;
};

type CombinedProps = ConnectedState & ConnectedDispatch & Props;
class FilmsPage extends React.Component<CombinedProps> {
    public componentWillMount() {
        if (!this.props.loading) {
            this.props.getFilms(this.props.page);
        }
    }

    public componentWillReceiveProps(props: CombinedProps) {
        const needPage = !props.loaded && !props.failed;
        const pageChanged = props.page !== this.props.page;
        if (!props.loading && (pageChanged || needPage)) {
            this.props.getFilms(props.page);
        }
    }

    public render() {
        if (!this.props.loaded) {
            return <Empty loading={this.props.loading} />;
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
        loading: page ? page.loading : false,
        loaded: page ? page.loaded : false,
        failed: page ? page.failed : false
    };
};

const mapDispatchToProps = (dispatch: redux.Dispatch<Store.All>): ConnectedDispatch => ({
    getFilms: (page: number) => dispatch(getFilms(page))
});

export default connect(mapStateToProps, mapDispatchToProps)(FilmsPage);
