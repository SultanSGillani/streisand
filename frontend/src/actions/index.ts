import AuthAction from './auth';
import WikiAction from './wikis';
import FilmAction from './films';
import UserAction from './users';
import ForumAction from './forums';
import TorrentAction from './torrents';
import DeviceAction from './DeviceAction';
import MessageAction from './MessageAction';
import MediaTypeAction from './MediaTypeAction';

type Action = MessageAction
    | MediaTypeAction
    | AuthAction
    | UserAction
    | FilmAction
    | TorrentAction
    | ForumAction
    | DeviceAction
    | WikiAction;
export default Action;
