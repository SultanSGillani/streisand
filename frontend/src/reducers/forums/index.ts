import { combineReducers } from '../helpers';
import IForumData from '../../models/forums/IForumData';

import groups from './groups';
import topics from './topics';
import threads from './threads';
import posts from './posts';

export default combineReducers<IForumData>({
    groups,
    topics,
    threads,
    posts
});
