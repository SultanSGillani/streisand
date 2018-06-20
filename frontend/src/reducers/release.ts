import * as objectAssign from 'object-assign';

import Store from '../store';
import IRelease from '../models/IRelease';
import { combineReducers } from './helpers';
import ReleaseAction from '../actions/releases';
import TorrentAction from '../actions/torrents';
import { INodeMap } from '../models/base/ItemSet';
import { addLoadedNode, addLoadedNodes } from './utilities/mutations';
import { INestedPage, IPage } from '../models/base/IPagedItemSet';
import { getPageReducer } from './utilities/page';

type Action = TorrentAction | ReleaseAction;

type ItemMap = INodeMap<IRelease>;
function byId(state: ItemMap = {}, action: Action): ItemMap {
    switch (action.type) {
        case 'RECEIVED_NEW_RELEASE':
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

const pageReducer = getPageReducer('RELEASES');
type Pages = { [page: number]: IPage };
function pages(state: Pages = {}, action: Action): Pages {
    switch (action.type) {
        case 'REQUEST_RELEASES':
        case 'RECEIVED_RELEASES':
        case 'FAILED_RELEASES':
        case 'INVALIDATE_RELEASES':
            const page: IPage = pageReducer(state[action.props.page], action);
            return objectAssign({}, state, { [action.props.page]: page });
        default:
            return state;
    }
}

function pageSize(state: number = 0, action: Action): number {
    switch (action.type) {
        case 'RECEIVED_RELEASES':
            return action.props.pageSize;
        default:
            return state;
    }
}

function count(state: number = 0, action: Action): number {
    switch (action.type) {
        case 'RECEIVED_RELEASES':
            return action.props.count;
        default:
            return state;
    }
}

const list = combineReducers<INestedPage>({ count, pageSize, pages });
export default combineReducers<Store.Releases>({ byId, list });