import * as React from 'react';
import * as redux from 'redux';
import { connect } from 'react-redux';

import Store from '../store';
import IUser from '../models/IUser';
import Empty from '../components/Empty';
import UserView from '../components/users/UserView';
import { numericIdentifier } from '../utilities/shim';
import { getUser } from '../actions/users/UserAction';
import { isLoadingItem } from '../models/base/ILoadingItem';

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
    const item = state.sealed.users.byId[userId];

    let user: IUser | undefined;
    let loading = false;
    if (isLoadingItem(item)) {
        loading = item.loading;
    } else if (item) {
        user = item;
    }

    return {
        loading: loading,
        user: user,
        userId: userId
    };
};

const mapDispatchToProps = (dispatch: redux.Dispatch<Store.All>): ConnectedDispatch => ({
    getUser: (id: number) => dispatch(getUser(id))
});

const UserPage: React.ComponentClass<Props> =
    connect(mapStateToProps, mapDispatchToProps)(UserPageComponent);
export default UserPage;
