import * as React from 'react';
import { connect } from 'react-redux';

import Store from '../../state/store';
import ForumGroup from './ForumGroup';
import ForumTopicCreator from './ForumTopicCreator';
import IForumGroup from '../../models/forums/IForumGroup';

export type Props = {};

type ConnectedState = {
    forumGroups: IForumGroup[];
};
type ConnectedDispatch = {};

type CombinedProps = Props & ConnectedDispatch & ConnectedState;
class ForumViewComponent extends React.Component<CombinedProps> {
    public render() {
        const groups = this.props.forumGroups.map((group: IForumGroup) => {
            return (<ForumGroup group={group} key={group.id} />);
        });
        const topicCreator = groups.length ? <ForumTopicCreator groups={this.props.forumGroups} /> : undefined;
        return (
            <div>
                {groups}
                {topicCreator}
            </div>
        );
    }
}

const mapStateToProps = (state: Store.All, props: Props): ConnectedState => {
    const data = state.sealed.forum.group;
    const forumGroups = data.items.map((id: number) => {
        return state.sealed.forum.group.byId[id];
    });

    return { forumGroups };
};

const ForumView: React.ComponentClass<Props> =
    connect(mapStateToProps)(ForumViewComponent);
export default ForumView;
