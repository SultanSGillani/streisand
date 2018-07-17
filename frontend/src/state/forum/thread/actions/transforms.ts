
import { IForumGroupData } from '../../../../models/forums/IForumGroup';
import { IForumThreadPostsResponse, IForumThreadResponse } from '../../../../models/forums/IForumThread';

export function transformThreadPosts(response: IForumThreadPostsResponse): IForumGroupData {
    const result: IForumGroupData = {
        groups: [],
        topics: [],
        threads: [],
        posts: [],
        users: []
    };

    const { groups: group, topics: topic } = response;
    result.groups.push({
        id: group.id,
        title: group.name
    });

    result.topics.push({
        id: topic.id,
        group: topic.group,
        title: topic.name
    });

    result.threads.push({
        id: response.id,
        title: response.title,
        topic: response.topic,
        numberOfPosts: response.numberOfPosts,
        createdAt: response.createdAt,
        createdBy: response.createdBy,
        isLocked: response.isLocked,
        isSticky: response.isSticky
    });
    result.users.push(response.createdBy);

    for (const post of response.posts.results) {
        result.posts.push({
            id: post.id,
            thread: post.thread,
            author: post.author,
            createdAt: post.createdAt,
            modifiedAt: post.modifiedAt,
            body: post.body,
            modifiedBy: post.modifiedBy
        });
        result.users.push(post.author);
    }

    return result;
}

export function transformThreads(response: IForumThreadResponse[]): IForumGroupData {
    const result: IForumGroupData = {
        groups: [],
        topics: [],
        threads: [],
        posts: [],
        users: []
    };

    for (const thread of response) {
        const { groups: group, topics: topic } = thread;
        result.groups.push({
            id: group.id,
            title: group.name
        });

        result.topics.push({
            id: topic.id,
            group: topic.group,
            title: topic.name
        });

        result.threads.push({
            id: thread.id,
            title: thread.title,
            topic: thread.topic,
            numberOfPosts: thread.numberOfPosts,
            createdAt: thread.createdAt,
            createdBy: thread.createdBy,
            isLocked: thread.isLocked,
            isSticky: thread.isSticky
        });
    }

    return result;
}