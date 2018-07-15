
import { IItemSet } from './base/ItemSet';
import { ITrackerPeer } from './ITrackerPeer';
import { IItemPages } from './base/IPagedItemSet';

interface IPeerItemSet extends IItemSet<ITrackerPeer> {
    byTorrentId: { [id: number]: IItemPages };
}

export default IPeerItemSet;