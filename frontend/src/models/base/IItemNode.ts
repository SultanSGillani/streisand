import ILoadingStatus from './ILoadingStatus';

interface IItemNode<T> {
    status: ILoadingStatus;
    item?: T;
}

export default IItemNode;