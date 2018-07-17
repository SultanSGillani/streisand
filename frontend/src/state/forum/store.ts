
import { IForumGroupStore } from './group/store';
import { IForumTopicStore } from './topic/store';
import { IForumThreadStore } from './thread/store';
import { IForumPostStore } from './post/store';

export interface IForumStore {
    group: IForumGroupStore;
    topic: IForumTopicStore;
    thread: IForumThreadStore;
    post: IForumPostStore;
}