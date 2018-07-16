import * as React from 'react';
import { Table } from 'reactstrap';

import TorrentRow from './TorrentRow';
import IFilm from '../../models/IFilm';
import ITorrent from '../../models/ITorrent';
import AwesomeIcon from '../generic/AwesomeIcon';

export type Props = {
    film: IFilm;
    urlPrefix: string;
    selected?: number;
    torrents: ITorrent[];
    includeReleaseInfo: boolean;
};

export default function TorrentSection(props: Props) {
    const { torrents, film } = props;
    if (!torrents.length) {
        return <p>There were no torrents found.</p>;
    }

    const rows = torrents.map((torrent: ITorrent) => {
        const startOpen = torrent.id === props.selected;
        return (
            <TorrentRow film={film} torrent={torrent} key={torrent.id}
                includeReleaseInfo={props.includeReleaseInfo}
                startOpen={startOpen} urlPrefix={props.urlPrefix} />
        );
    });

    return (
        <Table>
            <thead>
                <tr>
                    <th>Torrent</th>
                    <th><AwesomeIcon type="sync" size="lg" /></th>
                    <th colSpan={2}>Size</th>
                </tr>
            </thead>
            <tbody>
                {rows}
            </tbody>
        </Table>
    );
}