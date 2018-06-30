
import Store from '../store';
import IRelease from '../models/IRelease';
import { combineReducers } from './helpers';
import ReleaseAction from '../actions/releases';
import TorrentAction from '../actions/torrents';
import { INodeMap } from '../models/base/ItemSet';
import { getPagesReducer } from './utilities/pages';
import { addLoadedNode, addLoadedNodes, markLoading, markFailed } from './utilities/mutations';

type Action = TorrentAction | ReleaseAction;

type ItemMap = INodeMap<IRelease>;
function byId(state: ItemMap = {}, action: Action): ItemMap {
    switch (action.type) {
        case 'REQUEST_RELEASE':
            return markLoading(state, action.props.id);
        case 'FAILED_RELEASE':
            return markFailed(state, action.props.id);
        case 'RECEIVED_RELEASE':
        case 'RECEIVED_NEW_RELEASE':
        case 'RECEIVED_RELEASE_UPDATE':
            return addLoadedNode(state, action.release);
        case 'RECEIVED_RELEASES':
            return addLoadedNodes(state, action.props.items);
        case 'RECEIVED_DETACHED_TORRENTS':
        case 'RECEIVED_FILM_TORRENTS':
            return addLoadedNodes(state, action.releases);
        default:
            return state;
    }
}

const list = getPagesReducer('RELEASES');
export default combineReducers<Store.Releases>({ byId, list });