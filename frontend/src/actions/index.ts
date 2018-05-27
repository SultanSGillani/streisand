import AuthAction from './auth';
import WikiAction from './wikis';
import FilmAction from './films';
import UserAction from './users';
import ForumAction from './forums';
import TorrentAction from './torrents';
import ErrorAction from './ErrorAction';
import DeviceAction from './DeviceAction';

type Action = ErrorAction
    | AuthAction
    | UserAction
    | FilmAction
    | TorrentAction
    | ForumAction
    | DeviceAction
    | WikiAction;
export default Action;
