import IUser from '../IUser';
import IForumPost from './IForumPost';
import IForumThread from './IForumThread';
import { IForumTopicResponse, IForumTopic } from './IForumTopic';

export interface IForumGroupResponse {
    id: number;
    name: string;
    sortOrder: number;
    topicCount: number;
    topicsData: IForumTopicResponse[];
}

export interface IForumGroup {
    id: number;
    title: string;
    topics?: number[];
}

export interface IForumGroupData {
    groups: IForumGroup[];
    topics: IForumTopic[];
    threads: IForumThread[];
    posts: IForumPost[];
    users: IUser[];
}

export default IForumGroup;