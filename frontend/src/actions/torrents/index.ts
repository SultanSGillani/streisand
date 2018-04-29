import TorrentAction from './TorrentAction';
import TorrentsAction from './TorrentsAction';
import FilmTorrentsAction from './FilmTorrentsAction';

type Action = TorrentsAction | TorrentAction | FilmTorrentsAction;
export default Action;