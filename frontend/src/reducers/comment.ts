// import * as objectAssign from 'object-assign';

import Store from '../store';
import Action from '../actions/comments';
import { combineReducers } from './helpers';
import { INodeMap } from '../models/base/ItemSet';
import { getPagesReducer } from './utilities/pages';
import { addLoadedNode, addLoadedNodes } from './utilities/mutations';
import { IComment } from '../models/IComment';

type ItemMap = INodeMap<IComment>;
function byId(state: ItemMap = {}, action: Action): ItemMap {
    switch (action.type) {
        // case 'RECEIVED_COMMENT_DELETION':
        //     const copy = objectAssign({}, state);
        //     delete copy[action.props.id];
        //     return copy;
        // case 'RECEIVED_COMMENT':
        case 'RECEIVED_NEW_COMMENT':
        // case 'RECEIVED_COMMENT_UPDATE':
            return addLoadedNode(state, action.comment);
        case 'RECEIVED_COMMENTS':
            return addLoadedNodes(state, action.props.items);
        default:
            return state;
    }
}

const list = getPagesReducer('COMMENTS');
export default combineReducers<Store.Comments>({ byId, list });