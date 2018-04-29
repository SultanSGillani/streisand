import * as React from 'react';
import * as redux from 'redux';
import { connect } from 'react-redux';

import Store from '../../store';
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
        if (!props.loading && props.page !== this.props.page) {
            this.props.getFilms(props.page);
        }
    }

    public render() {
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
        loading: page ? page.loading : false
    };
};

const mapDispatchToProps = (dispatch: redux.Dispatch<Store.All>): ConnectedDispatch => ({
    getFilms: (page: number) => dispatch(getFilms(page))
});

export default connect(mapStateToProps, mapDispatchToProps)(FilmsPage);
