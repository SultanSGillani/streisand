import IInvite, { IInviteResponse } from '../../models/IInvite';

export function transformInvite(response: IInviteResponse): IInvite {
    const { offeredBy, ...invite } = response;
    return {
        ...invite,
        id: invite.key,
        offeredBy: offeredBy.id
    };
}