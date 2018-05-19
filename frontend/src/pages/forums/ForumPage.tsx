import * as React from 'react';
import { connect } from 'react-redux';

import Store from '../../store';
import Empty from '../../components/Empty';
import { IDispatch } from '../../actions/ActionTypes';
import ForumView from '../../components/forums/ForumView';
import ILoadingStatus from '../../models/base/ILoadingStatus';
import { getForumGroups } from '../../actions/forums/ForumGroupsAction';

export type Props = {};

type ConnectedState = {
    status: ILoadingStatus;
};

type ConnectedDispatch = {
    getForumGroups: () => void;
};

type CombinedProps = ConnectedState & ConnectedDispatch & Props;
class ForumPage extends React.Component<CombinedProps> {
    public componentWillMount() {
        if (!this.props.status.loading) {
            this.props.getForumGroups();
        }
    }

    public componentWillReceiveProps(props: CombinedProps) {
        const status = props.status;
        const needGroups = !status.failed && (!status.loaded || status.outdated);
        if (!status.loading && needGroups) {
            this.props.getForumGroups();
        }
    }

    public render() {
        if (!this.props.status.loaded) {
            return <Empty loading={this.props.status.loading} />;
        }

        return (
            <ForumView />
        );
    }
}

const mapStateToProps = (state: Store.All): ConnectedState => ({
    status: state.sealed.forums.groups.status
});

const mapDispatchToProps = (dispatch: IDispatch): ConnectedDispatch => ({
    getForumGroups: () => dispatch(getForumGroups())
});

export default connect(mapStateToProps, mapDispatchToProps)(ForumPage);
