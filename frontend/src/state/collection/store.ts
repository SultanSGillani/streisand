import ICollection from '../../models/ICollection';
import { IItemList } from '../../models/base/IPagedItemSet';

export interface ICollectionStore extends IItemList<ICollection> {
    creating: boolean;
}
