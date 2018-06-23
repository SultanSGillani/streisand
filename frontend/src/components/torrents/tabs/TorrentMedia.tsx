import * as React from 'react';
import { Row, Col, Card, Table } from 'reactstrap';

import IRelease from '../../../models/IRelease';

interface IRowProps {
    label: string;
    value: string | number;
}

function InfoRow(props: IRowProps) {
    return (
        <tr>
            <td>{props.label}</td>
            <td>{props.value}</td>
        </tr>
    );
}

export interface ITorrentMediaProps {
    release: IRelease;
}

export default function TorrentMedia(props: ITorrentMediaProps) {
    const { release } = props;
    const info = release.mediainfo;
    return (
        <Row className="mt-2">
            <Col sm="6">
                <Card body>
                    <Table size="sm" className="table-borderless mb-0" striped>
                        <tbody>
                            {info && <InfoRow label="Runtime" value={info.runtime} />}
                            <InfoRow label="Codec" value={release.codec} />
                            <InfoRow label="Container" value={release.container} />
                            <InfoRow label="Cut" value={release.cut} />
                            {info && <InfoRow label="Bite rate" value={info.bitRate} />}
                            {info && <InfoRow label="Frame rate" value={info.frameRate} />}
                            <InfoRow label="Source" value={release.sourceMedia} />
                            {info && <InfoRow label="Aspect ratio" value={info.displayAspectRatio} />}
                            <InfoRow label="Resolution" value={release.resolution} />
                            {info && <InfoRow label="Width" value={info.resolutionWidth} />}
                            {info && <InfoRow label="Height" value={info.resolutionHeight} />}
                        </tbody>
                    </Table>
                </Card>
            </Col>
        </Row>
    );
}