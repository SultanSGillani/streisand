import IItemNode from '../models/base/IItemNode';
import { INodeMap } from '../models/base/ItemSet';
import { IItemPage, IItemPages } from '../models/base/IPagedItemSet';
import { defaultStatus } from '../models/base/ILoadingStatus';

export interface IGetItemsProps<T> {
    page: number;
    pages: { [page: number]: IItemPage };
    byId: { [id: number]: T };
}

/**
 * Returns the list of items for the given page filtering out undefined items.
 */
export function getItems<T>(props: IGetItemsProps<T>): T[] {
    const page = props.pages[props.page];
    const identifiers = (page ? page.items : []);
    const items: T[] = [];
    for (const id of identifiers) {
        const item = props.byId[id];
        if (item) {
            items.push(item);
        }
    }
    return items;
}

export interface IGetNodeItemsProps<T> {
    page: number;
    pages: { [page: number]: IItemPage };
    byId: INodeMap<T>;
}

/**
 * Returns the list of items for the given page filtering out empty nodes.
 */
export function getNodeItems<T>(props: IGetNodeItemsProps<T>): T[] {
    const page = props.pages[props.page];
    const identifiers = (page ? page.items : []);
    const items: T[] = [];
    for (const id of identifiers) {
        const node = props.byId[id];
        if (node && node.item) {
            items.push(node.item);
        }
    }
    return items;
}

export interface IGetItemProps<T> {
    id?: number | null;
    fallback?: boolean;
    byId: INodeMap<T>;
}

/**
 * Returns the item for the given item assuming the item was loaded.
 */
export function getItem<T>(props: IGetItemProps<T>): T | undefined {
    const node = props.byId[props.id as number];
    if (node && node.item) {
        return node.item;
    } else if (props.id) {
        return { id: props.id } as any as T;
    }
}

export function getNode<T>(props: IGetItemProps<T>): IItemNode<T> {
    return props.byId[props.id as number] || { status: defaultStatus };
}

export interface IGetItemPageProps {
    page: number;
    list?: IItemPages;
}

export function getItemPage(props: IGetItemPageProps): IItemPage {
    if (props.list) {
        const page = props.list.pages[props.page];
        if (page) {
            return page;
        }
    }
    return {
        items: [],
        status: defaultStatus
    };
}

export function getList(list?: IItemPages): IItemPages {
    return list ? list : {
        count: 0,
        pages: [],
        pageSize: 0
    };
}