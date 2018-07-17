
import TorrentAction from './TorrentAction';
import FilmTorrentsAction from './FilmTorrentsAction';
import UploadTorrentAction from './UploadTorrentAction';
import UpdateTorrentAction from './UpdateTorrentAction';
import DeleteTorrentAction from './DeleteTorrentAction';
import ReleaseTorrentsAction from './ReleaseTorrentsAction';
import DetachedTorrentsAction from './DetachedTorrentsAction';

type Action = TorrentAction | FilmTorrentsAction | UploadTorrentAction | UpdateTorrentAction | DetachedTorrentsAction | DeleteTorrentAction | ReleaseTorrentsAction;
export default Action;