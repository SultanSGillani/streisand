import * as React from 'react';
import { Card, CardTitle, CardText, Row, Col } from 'reactstrap';

import IRelease from '../../../models/IRelease';

export interface ITorrentInfoProps {
    release: IRelease;
}

export default function TorrentInfo(props: ITorrentInfoProps) {
    const { release } = props;
    return (
        <Row>
            <Col>
                <Card body>
                    <CardTitle>Release Information (nfo)</CardTitle>
                    <CardText style={{ maxHeight: '250px', overflowY: 'scroll' }}>
                        <pre>{release.nfo}</pre>
                    </CardText>
                </Card>
            </Col>
        </Row>
    );
}