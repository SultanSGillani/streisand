
import { IItemSet } from './ItemSet';
import ILoadingStatus from './ILoadingStatus';

export interface IPage {
    status: ILoadingStatus;
    items: number[];
}

export interface INestedPage {
    count: number;
    pageSize: number;
    pages: { [page: number]: IPage };
}

export interface IPagedItemSet<T> extends IItemSet<T> {
    list: INestedPage;
}

export interface INestedPages {
    [id: number]: INestedPage;
}

export interface ISomething<T> {
    list: {
        count: number;
        pageSize: number;
        pages: { [page: number]: IPage };
    };
    search: {
        count: number;
        pageSize: number;
        pages: { [page: number]: IPage };
    };
}

export default IPagedItemSet;