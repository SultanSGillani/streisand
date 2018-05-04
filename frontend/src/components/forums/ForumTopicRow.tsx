import * as React from 'react';
import * as redux from 'redux';
import { Link } from 'react-router';
import { connect } from 'react-redux';

import Store from '../../store';
import ForumPostCell from './ForumPostCell';
import IForumTopic from '../../models/forums/IForumTopic';
import { deleteForumTopic } from '../../actions/forums/DeleteTopicAction';

export type Props = {
    topic: IForumTopic;
};

type ConnectedState = {};

type ConnectedDispatch = {
    deleteForumTopic: (id: number) => void;
};

type CombinedProps = Props & ConnectedDispatch & ConnectedState;
class ForumTopicRowComponent extends React.Component<CombinedProps> {
    public render() {
        const topic = this.props.topic;
        const onDelete = () => { this.props.deleteForumTopic(topic.id); };
        return (
            <tr>
                <td><Link to={'/forum/topic/' + topic.id} title={topic.title}>{topic.title}</Link></td>
                <ForumPostCell id={topic.latestPost} />
                <td>{topic.numberOfThreads}</td>
                <td>{topic.numberOfPosts}</td>
                <td style={{ display: 'flex', flexFlow: 'row-reverse' }}>
                    <button className="btn btn-sm btn-danger" onClick={onDelete}>
                        <i className="fa fa-trash" style={{ fontSize: '14px' }} />
                    </button>
                </td>
            </tr>
        );
    }
}

const mapDispatchToProps = (dispatch: redux.Dispatch<Store.All>): ConnectedDispatch => ({
    deleteForumTopic: (id: number) => dispatch(deleteForumTopic(id))
});

const ForumTopicRow: React.ComponentClass<Props> =
    connect(undefined, mapDispatchToProps)(ForumTopicRowComponent);
export default ForumTopicRow;