
import { IForumTopic } from '../../../models/forums/IForumTopic';

export interface IForumTopicStore {
    byId: { [id: number]: IForumTopic };
}