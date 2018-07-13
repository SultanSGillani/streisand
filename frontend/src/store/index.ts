import { RouterState } from 'react-router-redux';

import IUser from '../models/IUser';
import IFilm from '../models/IFilm';
import IWiki from '../models/IWiki';
import IInvite from '../models/IInvite';
import IRelease from '../models/IRelease';
import IMessage from '../models/IMessage';
import IAuthInfo from '../models/IAuthInfo';
import { IComment } from '../models/IComment';
import IDeviceInfo from '../models/IDeviceInfo';
import IMediaTypes from '../models/IMediaTypes';
import IPeerItemSet from '../models/IPeerItemSet';
import ILocationInfo from '../models/ILocationInfo';
import IForumData from '../models/forums/IForumData';
import ITorrentItemSet from '../models/ITorrentItemSet';
import { IItemList, IItemPages } from '../models/base/IPagedItemSet';

namespace Store {
    export type Users = IItemList<IUser>;
    export type Films = IItemList<IFilm> & {
        search: IItemPages;
    };
    export type Wikis = IItemList<IWiki> & {
        creating: boolean;
    };
    export type Peers = IPeerItemSet;
    export type Invites = IItemList<IInvite>;
    export type News = { latest: number | null; loading: boolean; };
    export type CurrentUser = { id: number | null; loading: boolean; };
    export type Releases = IItemList<IRelease>;
    export type Comments = IItemList<IComment>;

    export type UserSealed = {
        currentUser: CurrentUser;
        auth: IAuthInfo;
        user: Users;
        film: Films;
        torrent: ITorrentItemSet;
        release: Releases;
        peer: Peers;
        wiki: Wikis;
        news: News;
        forums: IForumData;
        invite: Invites;
        comment: Comments;
    };

    export type All = {
        messages: IMessage[];
        routing: RouterState;
        location: ILocationInfo;
        deviceInfo: IDeviceInfo;
        mediaTypes: IMediaTypes;
        sealed: UserSealed;
    };
}

export default Store;
