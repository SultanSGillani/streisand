import * as React from 'react';
import { Card, CardTitle, CardText } from 'reactstrap';

import IRelease from '../../../models/IRelease';

export interface ITorrentInfoProps {
    release: IRelease;
}

export default function TorrentInfo(props: ITorrentInfoProps) {
    const { release } = props;
    return (
        <Card body style={{ maxHeight: '250px', overflowY: 'scroll' }}>
            <CardTitle>Release Information (nfo)</CardTitle>
            <CardText>{release.nfo}</CardText>
        </Card>
    );
}