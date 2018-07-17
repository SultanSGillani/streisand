
import { IForumGroupData } from '../../../../models/forums/IForumGroup';
import { IForumTopicResponse } from '../../../../models/forums/IForumTopic';

export function transformTopic(response: IForumTopicResponse): IForumGroupData {
    const result: IForumGroupData = {
        groups: [],
        topics: [],
        threads: [],
        posts: [],
        users: []
    };

    const { groups: group } = response;
    result.groups.push({
        id: group.id,
        title: group.name
    });

    result.topics.push({
        id: response.id,
        title: response.name,
        description: response.description,
        group: response.group,
        numberOfPosts: response.numberOfPosts
    });

    for (const thread of response.threads.results) {
        result.threads.push({
            id: thread.id,
            title: thread.title,
            topic: thread.topic,
            createdAt: thread.createdAt,
            createdBy: thread.createdBy,
            isLocked: thread.isLocked,
            isSticky: thread.isSticky,
            numberOfPosts: thread.numberOfPosts,
            latestPost: thread.latestPost && thread.latestPost.id
        });
        result.users.push(thread.createdBy);

        if (thread.latestPost) {
            const post = thread.latestPost;
            result.posts.push({
                id: post.id,
                thread: post.thread,
                author: post.author,
                createdAt: post.createdAt
            });
            result.users.push(post.author);
        }
    }

    return result;
}