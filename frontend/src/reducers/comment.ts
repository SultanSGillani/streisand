import * as objectAssign from 'object-assign';

import Store from '../store';
import Action from '../actions/comments';
import { combineReducers } from './helpers';
import { INodeMap } from '../models/base/ItemSet';
import { getPagesReducer } from './utilities/pages';
import { addLoadedNode, addLoadedNodes } from './utilities/mutations';
import { IComment } from '../models/IComment';
import { IItemPages } from '../models/base/IPagedItemSet';

type ItemMap = INodeMap<IComment>;
function byId(state: ItemMap = {}, action: Action): ItemMap {
    switch (action.type) {
        case 'RECEIVED_COMMENT_DELETION':
            const copy = objectAssign({}, state);
            delete copy[action.props.id];
            return copy;
        case 'RECEIVED_NEW_COMMENT':
        case 'RECEIVED_COMMENT_UPDATE':
            return addLoadedNode(state, action.comment);
        case 'RECEIVED_COMMENTS':
            return addLoadedNodes(state, action.props.items);
        default:
            return state;
    }
}

const filmPagesReducer = getPagesReducer('COMMENTS');
type Comments = { [id: number]: IItemPages };
function byFilmId(state: Comments = {}, action: Action): Comments {
    switch (action.type) {
        case 'REQUEST_COMMENTS':
        case 'RECEIVED_COMMENTS':
        case 'FAILED_COMMENTS':
        case 'INVALIDATE_COMMENTS':
            const currentItemSet = state[action.props.id];
            const newItemSet = filmPagesReducer(currentItemSet, action);
            return objectAssign({}, state, { [action.props.id]: newItemSet });
        default:
            return state;
    }
}

export default combineReducers<Store.Comments>({ byId, byFilmId });