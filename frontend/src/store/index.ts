import { RouterState } from 'react-router-redux';

import IUser from '../models/IUser';
import IFilm from '../models/IFilm';
import IWiki from '../models/IWiki';
import IInvite from '../models/IInvite';
import IRelease from '../models/IRelease';
import IMessage from '../models/IMessage';
import IAuthInfo from '../models/IAuthInfo';
import IDeviceInfo from '../models/IDeviceInfo';
import IMediaTypes from '../models/IMediaTypes';
import ILocationInfo from '../models/ILocationInfo';
import IForumData from '../models/forums/IForumData';
import ITorrentItemSet from '../models/ITorrentItemSet';
import IPagedItemSet, { INestedPage } from '../models/base/IPagedItemSet';

namespace Store {
    export type Users = IPagedItemSet<IUser>;
    export type Films = IPagedItemSet<IFilm> & {
        search: INestedPage;
    };
    export type Wikis = IPagedItemSet<IWiki> & {
        creating: boolean;
    };
    export type Invites = IPagedItemSet<IInvite>;
    export type News = { latest: number | null; loading: boolean; };
    export type CurrentUser = { id: number | null; loading: boolean; };
    export type Releases = IPagedItemSet<IRelease>;

    export type UserSealed = {
        currentUser: CurrentUser;
        auth: IAuthInfo;
        user: Users;
        film: Films;
        torrent: ITorrentItemSet;
        release: Releases;
        wiki: Wikis;
        news: News;
        forums: IForumData;
        invite: Invites;
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
