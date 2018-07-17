
import { IForumStore } from './store';
import { combineReducers } from '../reducers/helpers';

import post from './post/reducer';
import group from './group/reducer';
import topic from './topic/reducer';
import thread from './thread/reducer';

export default combineReducers<IForumStore>({
    group,
    topic,
    thread,
    post
});
