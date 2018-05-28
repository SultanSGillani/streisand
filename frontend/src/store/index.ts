import { RouterState } from 'react-router-redux';

import IUser from '../models/IUser';
import IFilm from '../models/IFilm';
import IWiki from '../models/IWiki';
import IMessage from '../models/IMessage';
import IAuthInfo from '../models/IAuthInfo';
import IDeviceInfo from '../models/IDeviceInfo';
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
    export type News = { latest: number | null; loading: boolean; };
    export type CurrentUser = { id: number | null; loading: boolean; };

    export type UserSealed = {
        currentUser: CurrentUser;
        auth: IAuthInfo;
        user: Users;
        film: Films;
        torrent: ITorrentItemSet;
        wiki: Wikis;
        news: News;
        forums: IForumData;
    };

    export type All = {
        messages: IMessage[];
        routing: RouterState;
        location: ILocationInfo;
        deviceInfo: IDeviceInfo;
        sealed: UserSealed;
    };
}

export default Store;
