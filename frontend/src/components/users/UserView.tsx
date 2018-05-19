import * as React from 'react';
import { ListGroup, ListGroupItem } from 'reactstrap';

import IUser from '../../models/IUser';
import { getDateDiff } from '../../utilities/dates';

export type Props = {
    user: IUser;
};

interface IRowProps {
    label: string;
    value: string | number | boolean;
}

function InfoRow(props: IRowProps) {
    return (
        <ListGroupItem>
            <strong>{props.label}</strong>: <span className="text-muted">{`${props.value}`}</span>
        </ListGroupItem>
    );
}

export default function UserView(props: Props) {
    const user = props.user;
    const details = user.details;
    if (!details) {
        return <div style={{ marginTop: '8px' }}>No information provided.</div>;
    }

    const lastSeeded = getDateDiff({ past: details.lastSeeded });
    return (
        <div>
            <h1>{user.username}</h1>
            <ListGroup>
                <InfoRow label="Acount status" value={details.accountStatus} />
                <InfoRow label="Class" value={details.userClass} />
                <InfoRow label="Email" value={details.email} />
                <InfoRow label="Donor" value={details.isDonor} />
                <InfoRow label="Custome title" value={details.customTitle || ''} />
                <InfoRow label="Description" value={details.profileDescription} />
                <InfoRow label="Average seeding size" value={details.averageSeedingSize} />
                <InfoRow label="Invites" value={details.inviteCount} />
                <InfoRow label="Bytes uploaded" value={details.bytesUploaded} />
                <InfoRow label="Bytes downloaded" value={details.bytesDownloaded} />
                <InfoRow label="Last seeded" value={lastSeeded} />
                <InfoRow label="Announce Key" value={details.announceKey} />
            </ListGroup>
        </div>
    );
}