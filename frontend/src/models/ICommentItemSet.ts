
import { IComment } from './IComment';
import { IItemSet } from './base/ItemSet';
import { IItemPages } from './base/IPagedItemSet';

interface ICommentItemSet extends IItemSet<IComment> {
    byFilmId: { [id: number]: IItemPages };
}

export default ICommentItemSet;