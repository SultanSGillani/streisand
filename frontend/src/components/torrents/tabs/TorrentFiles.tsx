import * as React from 'react';
import { Card, Table } from 'reactstrap';

import DataSize from '../../generic/DataSize';
import { ITorrent, ITorrentFile } from '../../../models/ITorrent';

export interface ITorrentFilesProps {
    torrent: ITorrent;
}

export default function TorrentFiles(props: ITorrentFilesProps) {
    const { torrent } = props;
    const files = torrent.files.map((file: ITorrentFile) => {
        return (
            <tr key={file.path}>
                <td>{file.path}</td>
                <td><DataSize size={file.size} /></td>
            </tr>
        );
    });
    return (
        <Card body>
            <Table size="sm" className="table-borderless mb-0" striped>
                <thead>
                    <tr>
                        <th>Path {torrent.directoryName && <span><small>(/{torrent.directoryName}/)</small></span>}</th>
                        <th>Size</th>
                    </tr>
                </thead>
                <tbody>
                    {files}
                </tbody>
            </Table>
        </Card>
    );
}