import * as React from 'react';
import * as redux from 'redux';
import { connect } from 'react-redux';

import Store from '../../store';
import WikisView from '../../components/wikis/WikisView';
import { getWikis } from '../../actions/wikis/WikisAction';

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
    getWikis: (page: number) => void;
};

type CombinedProps = ConnectedState & ConnectedDispatch & Props;
class WikisPage extends React.Component<CombinedProps> {
    public componentWillMount() {
        if (!this.props.loading) {
            this.props.getWikis(this.props.page);
        }
    }

    public componentWillReceiveProps(props: CombinedProps) {
        if (!props.loading && props.page !== this.props.page) {
            this.props.getWikis(props.page);
        }
    }

    public render() {
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
        loading: page ? page.loading : false
    };
};

const mapDispatchToProps = (dispatch: redux.Dispatch<Store.All>): ConnectedDispatch => ({
    getWikis: (page: number) => dispatch(getWikis(page))
});

export default connect(mapStateToProps, mapDispatchToProps)(WikisPage);
