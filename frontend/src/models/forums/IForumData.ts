import { IForumPost } from './IForumPost';
import { IForumGroup } from './IForumGroup';
import { IForumTopic } from './IForumTopic';
import { IForumThread } from './IForumThread';
import ILoadingStatus from '../base/ILoadingStatus';
import { INestedPages } from '../base/IPagedItemSet';

export interface IForumGroupData {
    status: ILoadingStatus;
    items: number[];
    byId: { [id: number]: IForumGroup };
}

export type ForumTopicData = {
    byId: { [id: number]: IForumTopic };
};

export type ForumThreadData = {
    byId: { [id: number]: IForumThread };
    byTopic: INestedPages;
};

export type ForumPostData = {
    byId: { [id: number]: IForumPost };
    byThread: INestedPages;
};

interface IForumData {
    groups: IForumGroupData;
    topics: ForumTopicData;
    threads: ForumThreadData;
    posts: ForumPostData;
}

export default IForumData;