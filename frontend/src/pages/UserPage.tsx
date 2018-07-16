import * as React from 'react';
import { connect } from 'react-redux';

import Store from '../store';
import IUser from '../models/IUser';
import { getNode } from '../utilities/mapping';
import Empty from '../components/generic/Empty';
import { IDispatch } from '../state/actions/ActionTypes';
import Loading from '../components/generic/Loading';
import UserView from '../components/users/UserView';
import { numericIdentifier } from '../utilities/shim';
import { getUser } from '../actions/users/UserAction';
import ILoadingStatus from '../models/base/ILoadingStatus';

export type Props = {
    params: {
        userId: string;
    };
};

type ConnectedState = {
    userId: number;
    user?: IUser;
    status: ILoadingStatus;
};

type ConnectedDispatch = {
    getUser: (id: number) => void;
};

type CombinedProps = ConnectedState & ConnectedDispatch & Props;
class UserPageComponent extends React.Component<CombinedProps, void> {
    public componentWillMount() {
        const hasContent = this.props.user && this.props.user.details;
        if (!this.props.status.loading && !hasContent) {
            this.props.getUser(this.props.userId);
        }
    }

    public componentWillReceiveProps(props: CombinedProps) {
        const status = props.status;
        const changed = props.userId !== this.props.userId;
        const hasContent = props.user && props.user.details;
        const needUpdate = !status.failed && (!status.loaded || status.outdated);
        if (!status.loading && (changed || needUpdate || !hasContent)) {
            props.getUser(props.userId);
        }
    }

    public render() {
        const user = this.props.user;
        if (!user || !user.details) {
            return this.props.status.loading ? <Loading /> : <Empty />;
        }

        return (
            <UserView user={user} />
        );
    }
}

const mapStateToProps = (state: Store.All, props: Props): ConnectedState => {
    const userId = numericIdentifier(props.params.userId);
    const node = getNode({ id: userId, byId: state.sealed.user.byId });
    return {
        userId: userId,
        user: node.item,
        status: node.status
    };
};

const mapDispatchToProps = (dispatch: IDispatch): ConnectedDispatch => ({
    getUser: (id: number) => dispatch(getUser(id))
});

const UserPage: React.ComponentClass<Props> =
    connect(mapStateToProps, mapDispatchToProps)(UserPageComponent);
export default UserPage;
