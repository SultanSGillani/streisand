import { IForumPost } from './IForumPost';
import { IForumGroup } from './IForumGroup';
import { IForumTopic } from './IForumTopic';
import { IForumThread } from './IForumThread';
import { INestedPages } from '../base/IPagedItemSet';

export type ForumGroupData = {
    loading: boolean;
    items: IForumGroup[];
    byId: { [id: number]: IForumGroup };
};

export type ForumTopicData = {
    byId: { [id: number]: IForumTopic };
};

export type ForumThreadData = {
    byId: { [id: number]: IForumThread };
    byTopic: INestedPages<IForumThread>;
};

export type ForumPostData = {
    byId: { [id: number]: IForumPost };
    byThread: INestedPages<IForumPost>;
};

interface IForumData {
    groups: ForumGroupData;
    topics: ForumTopicData;
    threads: ForumThreadData;
    posts: ForumPostData;
}

export default IForumData;