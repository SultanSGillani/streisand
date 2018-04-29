import ITorrent from './ITorrent';
import { IPagedItemSet, IPage } from './base/IPagedItemSet';

interface ITorrentItemSet extends IPagedItemSet<ITorrent> {
    byFilmId: { [id: number]: IPage<ITorrent> };
}

export default ITorrentItemSet;