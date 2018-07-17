
import IUser, { IUserResponse } from '../../../models/IUser';

export function transformUser(user: IUserResponse): IUser {
    const {
        id,
        username,
        accountStatus,
        avatarUrl,
        customTitle,
        isDonor,
        userClass,
        ...props
    } = user;

    return {
        id,
        username,
        accountStatus,
        avatarUrl,
        customTitle,
        isDonor,
        userClass,
        details: { ...props }
    };
}
