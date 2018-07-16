
import { IItemSet } from '../../models/base/ItemSet';
import { ITrackerPeer } from '../../models/ITrackerPeer';
import { IItemPages } from '../../models/base/IPagedItemSet';

export interface IPeerStore extends IItemSet<ITrackerPeer> {
    byTorrentId: { [id: number]: IItemPages };
}