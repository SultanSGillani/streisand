import * as React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

import Store from '../../state/store';
import ForumPostCell from './ForumPostCell';
import DeleteCell from '../generic/DeleteCell';
import { ScreenSize } from '../../models/IDeviceInfo';
import IForumTopic from '../../models/forums/IForumTopic';
import { IDispatch } from '../../state/actions/ActionTypes';
import { deleteForumTopic, IActionProps } from '../../state/forum/topic/actions/DeleteTopicAction';

export type Props = {
    topic: IForumTopic;
};

type ConnectedState = {
    screenSize: ScreenSize;
};

type ConnectedDispatch = {
    deleteForumTopic: (props: IActionProps) => void;
};

type CombinedProps = Props & ConnectedDispatch & ConnectedState;
class ForumTopicRowComponent extends React.Component<CombinedProps> {
    public render() {
        const topic = this.props.topic;
        const onDelete = () => {
            this.props.deleteForumTopic({
                group: topic.group,
                topic: topic.id
            });
        };
        const full = this.props.screenSize > ScreenSize.small || undefined;
        return (
            <tr>
                <td className="align-middle"><Link to={'/forum/topic/' + topic.id} title={topic.title}>{topic.title}</Link></td>
                <ForumPostCell id={topic.latestPost} />
                {full && <>
                    <td className="align-middle">{topic.numberOfThreads}</td>
                    <td className="align-middle">{topic.numberOfPosts}</td>
                    <DeleteCell onDelete={onDelete} />
                </>}
            </tr>
        );
    }
}
const mapStateToProps = (state: Store.All): ConnectedState => ({
    screenSize: state.deviceInfo.screenSize
});

const mapDispatchToProps = (dispatch: IDispatch): ConnectedDispatch => ({
    deleteForumTopic: (props: IActionProps) => dispatch(deleteForumTopic(props))
});

const ForumTopicRow: React.ComponentClass<Props> =
    connect(mapStateToProps, mapDispatchToProps)(ForumTopicRowComponent);
export default ForumTopicRow;