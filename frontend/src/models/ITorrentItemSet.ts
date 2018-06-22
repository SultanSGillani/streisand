import ITorrent from './ITorrent';
import { IItemSet } from './base/ItemSet';
import { IItemPages } from './base/IPagedItemSet';

interface ITorrentItemSet extends IItemSet<ITorrent> {
    detached: IItemPages;
    byFilmId: { [id: number]: IItemPages };
}

export default ITorrentItemSet;