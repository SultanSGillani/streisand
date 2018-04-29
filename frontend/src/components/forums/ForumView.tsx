import * as React from 'react';
import { connect } from 'react-redux';

import Store from '../../store';
import ForumGroup from './ForumGroup';
import IForumGroup from '../../models/forums/IForumGroup';

export type Props = {};

type ConnectedState = {
    forumGroups: IForumGroup[];
};
type ConnectedDispatch = {};

type CombinedProps = Props & ConnectedDispatch & ConnectedState;
class ForumGroupsViewComponent extends React.Component<CombinedProps> {
    public render() {
        const groups = this.props.forumGroups.map((group: IForumGroup) => {
            return (<ForumGroup group={group} key={group.id} />);
        });
        return (
            <div>
                {groups}
            </div>
        );
    }
}

const mapStateToProps = (state: Store.All, ownProps: Props): ConnectedState => {
    const page = state.sealed.forums.groups;
    return {
        forumGroups: page ? page.items : []
    };
};

const ForumGroupsView: React.ComponentClass<Props> =
    connect(mapStateToProps)(ForumGroupsViewComponent);
export default ForumGroupsView;
