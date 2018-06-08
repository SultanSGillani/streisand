
import IItemNode from './IItemNode';

export interface INodeMap<T> {
    [id: number]: IItemNode<T>;
}

export interface IItemSet<T> {
    byId: INodeMap<T>;
}

export default IItemSet;