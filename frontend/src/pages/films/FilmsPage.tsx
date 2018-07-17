import * as React from 'react';
import { connect } from 'react-redux';

import Store from '../../state/store';
import { parsePageNumber } from '../../utilities/shim';
import FilmsView from '../../components/films/FilmsView';
import { IDispatch } from '../../state/actions/ActionTypes';
import { getFilms } from '../../state/film/actions/FilmsAction';
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
        return (
            <FilmsView page={this.props.page} />
        );
    }
}

const mapStateToProps = (state: Store.All, props: Props): ConnectedState => {
    const pageNumber = parsePageNumber(props.params && props.params.page);
    const page = state.sealed.film.list.pages[pageNumber];
    return {
        page: pageNumber,
        status: page ? page.status : defaultStatus
    };
};

const mapDispatchToProps = (dispatch: IDispatch): ConnectedDispatch => ({
    getFilms: (page: number) => dispatch(getFilms(page))
});

export default connect(mapStateToProps, mapDispatchToProps)(FilmsPage);
