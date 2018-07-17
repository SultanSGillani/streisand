
import { ITorrent } from '../../models/ITorrent';
import { IItemSet } from '../../models/base/ItemSet';
import { IItemPages } from '../../models/base/IPagedItemSet';

export interface ITorrentStore extends IItemSet<ITorrent> {
    detached: IItemPages;
    byFilmId: { [id: number]: IItemPages };
    byReleaseId: { [id: number]: IItemPages };
}