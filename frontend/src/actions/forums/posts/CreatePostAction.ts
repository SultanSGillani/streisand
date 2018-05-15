import { push } from 'react-router-redux';

import Store from '../../../store';
import globals from '../../../utilities/globals';
import { post } from '../../../utilities/Requestor';
import { invalidate } from '../threads/ForumThreadAction';
import { IUnkownError } from '../../../models/base/IError';
import { ThunkAction, IDispatch } from '../../ActionTypes';
import ErrorAction, { handleError } from '../../ErrorAction';
import { IForumPostUpdate } from '../../../models/forums/IForumPost';

type CreatePostAction =
    { type: 'CREATING_FORUM_POST', thread: number, body: string } |
    { type: 'CREATED_FORUM_POST', id: number } |
    { type: 'FAILED_CREATING_FORUM_POST' };
export default CreatePostAction;
type Action = CreatePostAction | ErrorAction;

function creating(post: IForumPostUpdate): Action {
    return { type: 'CREATING_FORUM_POST', thread: post.thread, body: post.body };
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
            const page = state.sealed.forums.posts.byThread[post.thread];
            const count = (page.count || 0) + 1;
            const lastPage = Math.ceil(count / globals.pageSize) || 1;

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
    return post({ token, data, url: `${globals.apiUrl}/forum-post-items/` });
}