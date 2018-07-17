
import { IComment } from '../../models/IComment';
import { IItemSet } from '../../models/base/ItemSet';
import { IItemPages } from '../../models/base/IPagedItemSet';

export interface ICommentStore extends IItemSet<IComment> {
    byFilmId: { [id: number]: IItemPages };
}