
import IUser from '../../models/IUser';
import { IItemList } from '../../models/base/IPagedItemSet';

export interface ICurrentUserStore {
    id: number | null;
    loading: boolean;
}

export interface IUserStore extends IItemList<IUser> {
    current: ICurrentUserStore;
}