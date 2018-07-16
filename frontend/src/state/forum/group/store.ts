
import ILoadingStatus from '../../../models/base/ILoadingStatus';
import { IForumGroup } from '../../../models/forums/IForumGroup';

export interface IForumGroupStore {
    status: ILoadingStatus;
    items: number[];
    byId: { [id: number]: IForumGroup };
}
