import * as React from 'react';
import * as redux from 'redux';
import { connect } from 'react-redux';

import Store from '../../store';
import Empty from '../../components/Empty';
import ForumView from '../../components/forums/ForumView';
import { getForumGroups } from '../../actions/forums/ForumGroupsAction';

export type Props = { };

type ConnectedState = {
    loading: boolean;
};

type ConnectedDispatch = {
    getForumGroups: () => void;
};

type CombinedProps = ConnectedState & ConnectedDispatch & Props;
class ForumPage extends React.Component<CombinedProps> {
    public componentWillMount() {
        if (!this.props.loading) {
            this.props.getForumGroups();
        }
    }

    public render() {
        if (this.props.loading) {
            return <Empty loading={this.props.loading} />;
        }

        return (
            <ForumView />
        );
    }
}

const mapStateToProps = (state: Store.All): ConnectedState => ({
    loading: state.sealed.forums.groups.loading
});

const mapDispatchToProps = (dispatch: redux.Dispatch<Store.All>): ConnectedDispatch => ({
    getForumGroups: () => dispatch(getForumGroups())
});

export default connect(mapStateToProps, mapDispatchToProps)(ForumPage);
