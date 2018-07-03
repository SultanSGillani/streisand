import * as React from 'react';
import { Card, CardTitle, CardText } from 'reactstrap';

import IUser from '../../../models/IUser';
import UserLink from '../../links/UserLink';
import TextView from '../../bbcode/TextView';
import IRelease from '../../../models/IRelease';
import { ITorrent } from '../../../models/ITorrent';
import TimeElapsed from '../../generic/TimeElapsed';

export interface IGeneralContentProps {
    release: IRelease;
    torrent: ITorrent;
    uploader?: IUser;
}

export default function GeneralContent(props: IGeneralContentProps) {
    const { release, torrent, uploader } = props;
    return (
        <>
            <Card body className="my-1">
                <CardTitle>User information</CardTitle>
                <CardText>
                    Uploaded by <UserLink user={uploader} /> <TimeElapsed date={torrent.uploadedAt} />
                </CardText>
            </Card>
            <Card body className="my-1">
                <CardTitle>Release Information</CardTitle>
                <CardText>{release.releaseGroup} / {release.releaseName}</CardText>
                <TextView content={release.description} />
            </Card>
        </>
    );
}