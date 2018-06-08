import * as objectAssign from 'object-assign';
import IItemNode from '../../models/base/IItemNode';
import { INodeMap } from '../../models/base/ItemSet';

export function markLoading<T>(current: INodeMap<T>, id: number): INodeMap<T> {
    const node = current[id];
    const status = objectAssign({}, node ? node.status : {}, { loading: true });
    const newNode = objectAssign({}, node, { status });
    return objectAssign({}, current, { [id]: newNode });
}

export function markFailed<T>(current: INodeMap<T>, id: number): INodeMap<T> {
    const node = current[id];
    const status = objectAssign({}, node ? node.status : {}, { loading: false, failed: true });
    const newNode = objectAssign({}, node, { status });
    return objectAssign({}, current, { [id]: newNode });
}

export interface IItem { id: number; }
export function addLoadedNode<T extends IItem>(current: INodeMap<T>, item: T): INodeMap<T> {
    const node: IItemNode<T> = {
        status: {
            loading: false,
            loaded: true,
            failed: false,
            outdated: false
        },
        item: item
    };
    return objectAssign({}, current, { [item.id]: node });
}

export function addLoadedNodes<T extends IItem>(current: INodeMap<T>, items: T[]): INodeMap<T> {
    let map: INodeMap<T> = {};
    for (const item of items) {
        const node: IItemNode<T> = {
            status: {
                loading: false,
                loaded: true,
                failed: false,
                outdated: false
            },
            item: item
        };
        map[item.id] = node;
    }
    return objectAssign({}, current, map);
}