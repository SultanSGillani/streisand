import * as React from 'react';
import { Link } from 'react-router';

import IUser from '../../models/IUser';

export interface IUserLinkProps {
    user?: IUser;
}

export default function UserLink(props: IUserLinkProps) {
    const userName = props.user && props.user.username ? props.user.username : '<unkown>';
    if (!props.user || !props.user.id) {
        return (<span>{userName}</span>);
    }

    return (<Link to={'/user/' + props.user.id}>{userName}</Link>);
}