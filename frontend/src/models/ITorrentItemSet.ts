import ITorrent from './ITorrent';
import { IPagedItemSet, IPage } from './base/IPagedItemSet';

interface ITorrentItemSet extends IPagedItemSet<ITorrent> {
    byFilmId: { [id: number]: { [page: number]: IPage } };
}

export default ITorrentItemSet;