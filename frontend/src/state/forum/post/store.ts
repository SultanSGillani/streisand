
import { IForumPost } from '../../../models/forums/IForumPost';
import { INestedPages } from '../../../models/base/IPagedItemSet';

export interface IForumPostStore {
    byId: { [id: number]: IForumPost };
    byThread: INestedPages;
}