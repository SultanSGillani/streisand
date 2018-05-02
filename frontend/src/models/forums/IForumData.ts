import { IForumPost } from './IForumPost';
import { IForumGroup } from './IForumGroup';
import { IForumTopic } from './IForumTopic';
import { IForumThread } from './IForumThread';
import ILoadingItem from '../base/ILoadingItem';
import { INestedPages } from '../base/IPagedItemSet';

export type ForumGroupData = {
    loading: boolean;
    items: IForumGroup[];
    byId: { [id: number]: IForumGroup };
};

export type ForumTopicData = {
    byId: { [id: number]: ILoadingItem | IForumTopic };
};

export type ForumThreadData = {
    byId: { [id: number]: ILoadingItem | IForumThread };
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