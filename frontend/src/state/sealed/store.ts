
import { IWikiStore } from '../wiki/store';
import { IAuthStore } from '../auth/store';
import { IUserStore } from '../user/store';
import { IFilmStore } from '../film/store';
import { ITorrentStore } from '../torrent/store';
import { INewsStore } from '../news/store';
import { IForumStore } from '../forum/store';
import { IReleaseStore } from '../release/store';
import { IInviteStore } from '../invite/store';
import { IPeerStore } from '../peer/store';
import { ICommentStore } from '../comment/store';
import { ICollectionStore } from '../collection/store';


export interface ISealedStore {
    auth: IAuthStore;
    user: IUserStore;
    film: IFilmStore;
    torrent: ITorrentStore;
    wiki: IWikiStore;
    news: INewsStore;
    forum: IForumStore;
    release: IReleaseStore;
    invite: IInviteStore;
    peer: IPeerStore;
    comment: ICommentStore;
    collection: ICollectionStore;
}
