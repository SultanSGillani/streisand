
import ReleaseAction from './ReleaseAction';
import ReleasesAction from './ReleasesAction';
import CreateTorrentAction from './CreateReleaseAction';
import DeleteReleaseAction from './DeleteReleaseAction';
import UpdateReleaseAction from './UpdateReleaseAction';

type Action = ReleaseAction | ReleasesAction | CreateTorrentAction | DeleteReleaseAction | UpdateReleaseAction;
export default Action;