import * as React from 'react';
import * as redux from 'redux';
import { Link } from 'react-router';
import { connect } from 'react-redux';

import Store from '../../store';
import ForumPostCell from './ForumPostCell';
import DeleteCell from '../generic/DeleteCell';
import IForumTopic from '../../models/forums/IForumTopic';
import { deleteForumTopic, IDeleteTopicProps } from '../../actions/forums/topics/DeleteTopicAction';

export type Props = {
    topic: IForumTopic;
};

type ConnectedState = {};

type ConnectedDispatch = {
    deleteForumTopic: (props: IDeleteTopicProps) => void;
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
        return (
            <tr>
                <td className="align-middle"><Link to={'/forum/topic/' + topic.id} title={topic.title}>{topic.title}</Link></td>
                <ForumPostCell id={topic.latestPost} />
                <td className="align-middle">{topic.numberOfThreads}</td>
                <td className="align-middle">{topic.numberOfPosts}</td>
                <DeleteCell onDelete={onDelete} />
            </tr>
        );
    }
}

const mapDispatchToProps = (dispatch: redux.Dispatch<Store.All>): ConnectedDispatch => ({
    deleteForumTopic: (props: IDeleteTopicProps) => dispatch(deleteForumTopic(props))
});

const ForumTopicRow: React.ComponentClass<Props> =
    connect(undefined, mapDispatchToProps)(ForumTopicRowComponent);
export default ForumTopicRow;