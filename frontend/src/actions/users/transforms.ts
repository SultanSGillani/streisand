import IUser, { IUserResponse } from '../../models/IUser';

export function transformUser(user: IUserResponse): IUser {
    const { id, username, ...props } = user;
    return {
        id: user.id,
        username: user.username,
        details: { ...props }
    };
}
