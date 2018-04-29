import * as React from 'react';
import { Link } from 'react-router';

import ForumPostCell from './ForumPostCell';
import IForumTopic from '../../models/forums/IForumTopic';

export type Props = {
    topic: IForumTopic;
};

export default function ForumTopicRow(props: Props) {
    const topic = props.topic;
    return (
        <tr>
            <td>
                <Link to={'/forum/topic/' + topic.id} title={topic.title}>{topic.title}</Link>
            </td>
            <ForumPostCell id={topic.latestPost} />
            <td>{topic.numberOfThreads}</td>
            <td>{topic.numberOfPosts}</td>
        </tr>
    );
}