import Store from '../../store';
import globals from '../../utilities/globals';
import { post } from '../../utilities/Requestor';
import { ThunkAction, IDispatch } from '../ActionTypes';

import { IUnkownError } from '../../models/base/IError';
import ErrorAction, { handleError } from '../ErrorAction';
import { IForumPostUpdate } from '../../models/forums/IForumPost';
import { invalidate } from './ForumThreadAction';
import { push } from 'react-router-redux';

type CreateForumPostAction =
    { type: 'CREATING_FORUM_POST', thread: number, body: string } |
    { type: 'CREATED_FORUM_POST', id: number } |
    { type: 'FAILED_CREATING_FORUM_POST' };
export default CreateForumPostAction;
type Action = CreateForumPostAction | ErrorAction;

function creating(post: IForumPostUpdate) {
    return { type: 'CREATING_WIKI', post };
}

function created(id: number): Action {
    return { type: 'CREATED_FORUM_POST', id };
}

function failure(): Action {
    return { type: 'FAILED_CREATING_FORUM_POST' };
}

export function postReply(post: IForumPostUpdate): ThunkAction<Action> {
    return (dispatch: IDispatch<Action>, getState: () => Store.All) => {
        const state = getState();
        dispatch(creating(post));
        return create(state.sealed.auth.token, post).then((response: any) => {
            const action = dispatch(created(response.id));

            // Ideally this response would include the position of the new post so
            // we don't have to guess which page it is going to be on.
            const numberOfPosts = (state.sealed.forums.threads.byId[post.thread].numberOfPosts || 0) + 1;
            const lastPage = Math.ceil(numberOfPosts / globals.pageSize) || 1;

            // Invalidate last page of posts
            dispatch(invalidate({ id: post.thread, page: lastPage }));
            // Navigate to last page
            dispatch(push(`/forum/thread/${post.thread}/${lastPage}`));
            return action;
        }, (error: IUnkownError) => {
            dispatch(failure());
            return dispatch(handleError(error));
        });
    };
}

function create(token: string, data: IForumPostUpdate): Promise<any> {
    return post({ token, data, url: `${globals.apiUrl}/forum-posts/` });
}