
import { IForumPost, IForumPostResponse } from '../../../../models/forums/IForumPost';

export function transformPostOnly(response: IForumPostResponse): IForumPost {
    return {
        id: response.id,
        thread: response.thread,
        author: response.author,
        createdAt: response.createdAt,
        modifiedAt: response.modifiedAt,
        body: response.body,
        modifiedBy: response.modifiedBy
    };
}