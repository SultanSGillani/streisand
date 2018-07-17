
import { IForumThread } from '../../../models/forums/IForumThread';
import { INestedPages, IItemPages } from '../../../models/base/IPagedItemSet';

export interface IForumThreadStore {
    byId: { [id: number]: IForumThread };
    byTopic: INestedPages;
    search: IItemPages;
};