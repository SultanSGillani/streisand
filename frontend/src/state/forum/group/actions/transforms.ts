
import { IForumGroupResponse, IForumGroupData } from '../../../../models/forums/IForumGroup';

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