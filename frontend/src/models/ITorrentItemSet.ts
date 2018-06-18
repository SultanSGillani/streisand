import ITorrent from './ITorrent';
import { IItemSet } from './base/ItemSet';
import { IPage, INestedPage } from './base/IPagedItemSet';

interface ITorrentItemSet extends IItemSet<ITorrent> {
    detached: INestedPage;
    byFilmId: { [id: number]: { [page: number]: IPage } };
}

export default ITorrentItemSet;