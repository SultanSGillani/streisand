
import IUser from '../../models/IUser';
import { ITrackerPeerResponse, ITrackerPeer } from '../../models/ITrackerPeer';

export interface IPeerInfo {
    peers: ITrackerPeer[];
    users: IUser[];
}

export function transformPeers(response: ITrackerPeerResponse[]): IPeerInfo {
    const peers: ITrackerPeer[] = [];
    const users: IUser[] = [];
    for (const raw of response) {
       const { user, ...peer } = raw;
       users.push(user);
       peers.push({
           ...peer,
           user: user.id
       });
    }
    return { peers, users };
}