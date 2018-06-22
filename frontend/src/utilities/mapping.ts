import IItemNode from '../models/base/IItemNode';
import { INodeMap } from '../models/base/ItemSet';
import { IItemPage } from '../models/base/IPagedItemSet';
import { defaultStatus } from '../models/base/ILoadingStatus';

export interface IGetItemsProps<T> {
    page: number;
    pages: { [page: number]: IItemPage };
    byId: { [id: number]: T};
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

/**
 * Returns the item for the given item assuming the item was loaded.
 */
export interface IGetItemProps<T> {
    id?: number | null;
    fallback?: boolean;
    byId: INodeMap<T>;
}

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