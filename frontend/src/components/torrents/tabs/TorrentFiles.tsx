import * as React from 'react';
import { Card, Table, CardText } from 'reactstrap';

import IUser from '../../../models/IUser';
import UserLink from '../../links/UserLink';
import DataSize from '../../generic/DataSize';
import TimeElapsed from '../../generic/TimeElapsed';
import { ITorrent, ITorrentFile } from '../../../models/ITorrent';

export interface ITorrentFilesProps {
    torrent: ITorrent;
    uploader?: IUser;
}

export default function TorrentFiles(props: ITorrentFilesProps) {
    const { torrent, uploader } = props;
    const files = torrent.files.map((file: ITorrentFile) => {
        return (
            <tr key={file.path}>
                <td>{file.path}</td>
                <td><DataSize size={file.size} /></td>
            </tr>
        );
    });
    return (
        <>
            <Card body className="my-1">
                <CardText>
                    Uploaded by <UserLink user={uploader} /> <TimeElapsed date={torrent.uploadedAt} />
                </CardText>
            </Card>
            <Card body className="p-1 p-sm-3">
                {torrent.directoryName && <span><small>(/{torrent.directoryName}/)</small></span>}
                <Table size="sm" className="table-borderless mb-0" striped>
                    <thead>
                        <tr>
                            <th>Path</th>
                            <th style={{ minWidth: '45px' }}>Size</th>
                        </tr>
                    </thead>
                    <tbody>
                        {files}
                    </tbody>
                </Table>
            </Card>
        </>
    );
}