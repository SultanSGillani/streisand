import IWiki from '../../models/IWiki';
import { IItemList } from '../../models/base/IPagedItemSet';

export interface IWikiStore extends IItemList<IWiki> {
    creating: boolean;
}