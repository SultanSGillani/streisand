import IItemNode from './IItemNode';
import ILoadingStatus from './ILoadingStatus';

export interface IPage {
    status: ILoadingStatus;
    items: number[];
}

export interface INodeMap<T> {
    [id: number]: IItemNode<T>;
}

export interface IPagedItemSet<T> {
    count: number;
    byId: INodeMap<T>;
    pages: { [page: number]: IPage };
}

export interface INestedPage {
    count: number;
    pages: { [page: number]: IPage };
}

export interface INestedPages {
    [id: number]: INestedPage;
}

export default IPagedItemSet;