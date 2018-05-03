import * as React from 'react';
import { Link } from 'react-router';

import IForumThread from '../../models/forums/IForumThread';

export type Props = {
    thread: IForumThread;
};

export default function EmptyThreadCell(props: Props) {
    const thread = props.thread;
    const threadLink = <Link to={'/forum/thread/' + thread.id} title={thread.title}>{thread.title}</Link>;
    return (
        <td>No posts in {threadLink}</td>
    );
}
