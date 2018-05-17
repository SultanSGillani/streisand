import { IForumTopicResponse } from '../../models/forums/IForumTopic';
import { IForumThreadResponse } from '../../models/forums/IForumThread';
import { IForumGroupResponse, IForumGroupData } from '../../models/forums/IForumGroup';
import { IForumPost, IForumPostResponse } from '../../models/forums/IForumPost';
import { INewsPostData, INewsPostResponse } from '../../models/forums/INewsPost';

export function transformGroups(response: IForumGroupResponse): IForumGroupData {
    const result: IForumGroupData = {
        groups: [],
        topics: [],
        threads: [],
        posts: [],
        users: []
    };

    for (const group of response.results) {
        const transformedGroup = {
            id: group.id,
            title: group.name,
            topics: [] as number[]
        };
        result.groups.push(transformedGroup);
        for (const topic of group.topics) {
            transformedGroup.topics.push(topic.id);
            result.topics.push({
                id: topic.id,
                title: topic.name,
                group: group.id,
                sortOrder: topic.sortOrder,
                description: topic.description,
                numberOfThreads: topic.numberOfThreads,
                numberOfPosts: topic.numberOfPosts,
                latestPost: topic.latestPost && topic.latestPost.id
            });

            if (topic.latestPost) {
                result.threads.push({
                    id: topic.latestPost.thread,
                    title: topic.latestPost.threadTitle,
                    topic: topic.id
                });

                result.posts.push({
                    id: topic.latestPost.id,
                    thread: topic.latestPost.thread,
                    author: topic.latestPost.author,
                    createdAt: topic.latestPost.createdAt
                });

                result.users.push(topic.latestPost.author);
            }
        }
    }

    return result;
}

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

export function transformThread(response: IForumThreadResponse): IForumGroupData {
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