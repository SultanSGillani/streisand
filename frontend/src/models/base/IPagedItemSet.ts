import ILoadingItem from './ILoadingItem';

export interface IPage<T> {
    /* Whether there is a pending request for this page of items */
    loading: boolean;
    /* Whether there has been at least one successful fetch of this page of items */
    loaded: boolean;
    /* Whether the most recent fetch of this page of items failed */
    failed: boolean;
    items: T[];
}

export interface IPagedItemSet<T> {
    count: number;
    byId: { [id: number]: ILoadingItem | T };
    pages: { [page: number]: IPage<T> };
}

export interface INestedPage<T> {
    count: number;
    pages: { [page: number]: IPage<T> };
}

export interface INestedPages<T> {
    [id: number]: INestedPage<T>;
}

export default IPagedItemSet;