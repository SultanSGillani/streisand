import * as React from 'react';
import { connect } from 'react-redux';

import Store from '../../store';
import IUser from '../../models/IUser';
import IFilm from '../../models/IFilm';
import UserLink from '../links/UserLink';
import { IComment } from '../../models/IComment';
import { getItem } from '../../utilities/mapping';

export type Props = {
    film: IFilm;
    comment: IComment;
};

type ConnectedState = {
    user?: IUser;
};

type ConnectedDispatch = {};

type CombinedProps = Props & ConnectedDispatch & ConnectedState;
class CommentRowComponent extends React.Component<CombinedProps> {
    public render() {
        const { comment, user } = this.props;
        return (
            <tr>
                <td className="align-middle"><UserLink user={user} /></td>
                <td className="align-middle">{comment.text}</td>
            </tr>
        );
    }
}

const mapStateToProps = (state: Store.All, props: Props): ConnectedState => {
    return {
        user: getItem({
            id: props.comment.author,
            byId: state.sealed.user.byId
        })
    };
};

const CommentRow: React.ComponentClass<Props> =
    connect(mapStateToProps)(CommentRowComponent);
export default CommentRow;