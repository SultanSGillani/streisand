import AuthAction from '../auth/actions';
import UserAction from '../user/actions';
import PeerAction from '../peer/actions';
import FilmAction from '../film/actions';
import WikiAction from '../wiki/actions';
import ForumAction from '../forum/actions';
import MessageAction from '../message/actions';
import TorrentAction from '../torrent/actions';
import DeviceAction from '../deviceInfo/actions';
import MediaTypeAction from '../mediaTypes/actions';
import CollectionAction from '../collection/actions/CollectionAction';

type Action = MessageAction
    | MediaTypeAction
    | AuthAction
    | UserAction
    | FilmAction
    | TorrentAction
    | ForumAction
    | DeviceAction
    | WikiAction
    | PeerAction
    | CollectionAction;
export default Action;
