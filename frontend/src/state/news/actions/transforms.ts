
import { INewsPostData, INewsPostResponse } from '../../../models/forums/INewsPost';

export function transformNewsPost(post: INewsPostResponse): INewsPostData {
    if (!post || !post.id) {
        return { threads: [], posts: [], users: [] };
    }
    const result: INewsPostData = {
        threads: [{
            title: post.threadTitle,
            id: post.thread
        }],
        posts: [{
            id: post.id,
            thread: post.thread,
            author: post.author,
            createdAt: post.createdAt,
            modifiedAt: post.modifiedAt,
            body: post.body,
            modifiedBy: post.modifiedBy
        }],
        users: []
    };

    result.users.push(post.author);
    result.users.push(post.modifiedBy);
    return result;
}
