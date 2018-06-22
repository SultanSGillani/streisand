
import { IItemSet } from './ItemSet';
import ILoadingStatus from './ILoadingStatus';

export interface IItemPage {
    status: ILoadingStatus;
    items: number[];
}

export interface IItemPages {
    count: number;
    pageSize: number;
    pages: { [page: number]: IItemPage };
}

export interface IItemList<T> extends IItemSet<T> {
    list: IItemPages;
}

export interface INestedPages {
    [id: number]: IItemPages;
}