import * as objectAssign from 'object-assign';

import Action from '../../actions/forums';
import { combineReducers } from '../helpers';
import IForumGroup from '../../models/forums/IForumGroup';
import { IForumGroupData } from '../../models/forums/IForumData';
import { getLoadingStatusReducer } from '../utilities/loadingStatus';

function addGroups(groups: IForumGroup[]) {
    let map: ItemMap = {};
    for (const item of groups) {
        map[item.id] = item;
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
            return combineMap(state, addGroups(action.data.groups));
        case 'DELETED_FORUM_TOPIC':
            if (action.group) {
                return combineMap(state, { [action.group]: removeTopic(state[action.group], action.topic) });
            }
            return state;
        default:
            return state;
    }
}

function items(state: number[] = [], action: Action): number[] {
    switch (action.type) {
        case 'RECEIVED_FORUM_GROUPS':
            return action.data.groups.map((group: IForumGroup) => {
                return group.id;
            });
        default:
            return state;
    }
}

const status = getLoadingStatusReducer('FORUM_GROUPS');
export default combineReducers<IForumGroupData>({ byId, status, items });