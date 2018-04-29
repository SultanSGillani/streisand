
interface ILoadingItem {
    loading: true;
}

export function isLoadingItem(item: any): item is ILoadingItem {
    return item && item.hasOwnProperty('loading');
}

export default ILoadingItem;