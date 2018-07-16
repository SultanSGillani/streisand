import * as objectAssign from 'object-assign';

import Action from '../actions';
import { IForumGroupStore } from './store';
import { combineReducers } from '../../reducers/helpers';
import { IForumGroup } from '../../../models/forums/IForumGroup';
import { getLoadingStatusReducer } from '../../reducers/loadingStatus';

function addGroups(current: ItemMap, groups: IForumGroup[]): ItemMap {
    let map: ItemMap = {};
    for (const item of groups) {
        map[item.id] = objectAssign({}, current[item.id], item);
    }
    return map;
}

function combineMap<T>(current: T, newState: T): T {
    return objectAssign({}, current, newState);
}

function removeTopic(group: IForumGroup, topicId: number): IForumGroup {
    if (group && group.topics) {
        const topics = group.topics.filter((topic: number) => {
            return topic !== topicId;
        });
        return objectAssign({}, group, { topics });
    }
    return group;
}

type ItemMap = { [id: number]: IForumGroup };
function byId(state: ItemMap = {}, action: Action): ItemMap {
    switch (action.type) {
        case 'RECEIVED_FORUM_GROUPS':
        case 'RECEIVED_FORUM_TOPIC':
            return combineMap(state, addGroups(state, action.props.data.groups));
        case 'RECEIVED_FORUM_TOPIC_DELETION':
            if (action.props.group) {
                return combineMap(state, { [action.props.group]: removeTopic(state[action.props.group], action.props.topic) });
            }
            return state;
        default:
            return state;
    }
}

function items(state: number[] = [], action: Action): number[] {
    switch (action.type) {
        case 'RECEIVED_FORUM_GROUPS':
            return action.props.data.groups.map((group: IForumGroup) => {
                return group.id;
            });
        default:
            return state;
    }
}

const status = getLoadingStatusReducer('FORUM_GROUPS');
export default combineReducers<IForumGroupStore>({ byId, status, items });