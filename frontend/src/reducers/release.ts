
import Store from '../store';
import IRelease from '../models/IRelease';
import { combineReducers } from './helpers';
import ReleaseAction from '../actions/releases';
import TorrentAction from '../actions/torrents';
import { INodeMap } from '../models/base/ItemSet';
import { addLoadedNode, addLoadedNodes } from './utilities/mutations';

type Action = TorrentAction | ReleaseAction;

type ItemMap = INodeMap<IRelease>;
function byId(state: ItemMap = {}, action: Action): ItemMap {
    switch (action.type) {
        case 'RECEIVED_NEW_RELEASE':
            return addLoadedNode(state, action.release);
        case 'RECEIVED_DETACHED_TORRENTS':
        case 'RECEIVED_FILM_TORRENTS':
            return addLoadedNodes(state, action.releases);
        default:
            return state;
    }
}

export default combineReducers<Store.Releases>({ byId });