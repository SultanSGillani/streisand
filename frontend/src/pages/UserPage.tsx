import * as React from 'react';
import { connect } from 'react-redux';

import Store from '../store';
import IUser from '../models/IUser';
import Empty from '../components/Empty';
import { getNode } from '../utilities/mapping';
import { IDispatch } from '../actions/ActionTypes';
import UserView from '../components/users/UserView';
import { numericIdentifier } from '../utilities/shim';
import { getUser } from '../actions/users/UserAction';

export type Props = {
    params: {
        userId: string;
    };
};

type ConnectedState = {
    userId: number;
    user?: IUser;
    loading: boolean;
};

type ConnectedDispatch = {
    getUser: (id: number) => void;
};

type CombinedProps = ConnectedState & ConnectedDispatch & Props;
class UserPageComponent extends React.Component<CombinedProps, void> {
    public componentWillMount() {
        const hasContent = this.props.user && this.props.user.details;
        if (!this.props.loading && !hasContent) {
            this.props.getUser(this.props.userId);
        }
    }

    public componentWillReceiveProps(props: CombinedProps) {
        const hasContent = props.user && props.user.details;
        if (this.props.userId !== props.userId || (!props.loading && !hasContent)) {
            props.getUser(props.userId);
        }
    }

    public render() {
        const user = this.props.user;
        if (!user || !user.details || this.props.loading) {
            return <Empty loading={this.props.loading} />;
        }

        return (
            <UserView user={user} />
        );
    }
}

const mapStateToProps = (state: Store.All, ownProps: Props): ConnectedState => {
    const userId = numericIdentifier(ownProps.params.userId);
    const node = getNode({ id: userId, byId: state.sealed.users.byId });
    return {
        userId: userId,
        user: node.item,
        loading: node.status.loading
    };
};

const mapDispatchToProps = (dispatch: IDispatch): ConnectedDispatch => ({
    getUser: (id: number) => dispatch(getUser(id))
});

const UserPage: React.ComponentClass<Props> =
    connect(mapStateToProps, mapDispatchToProps)(UserPageComponent);
export default UserPage;
