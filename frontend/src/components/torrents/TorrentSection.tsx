import * as React from 'react';
import { Table } from 'reactstrap';

import TorrentRow from './TorrentRow';
import IFilm from '../../models/IFilm';
import ITorrent from '../../models/ITorrent';

export type Props = {
    film: IFilm;
    torrents: ITorrent[];
};

export default function TorrentSection(props: Props) {
    const { torrents, film } = props;
    if (!torrents.length) {
        return <p>There are no torrents uploaded for this film yet.</p>;
    }

    const rows = torrents.map((torrent: ITorrent) => {
        return (<TorrentRow film={film} torrent={torrent} key={torrent.id} />);
    });

    return (
        <Table className="table">
            <thead>
                <tr>
                    <th>Torrent</th>
                    <th><i className="fas fa-sync fa-lg" /></th>
                    <th colSpan={2}>Size</th>
                </tr>
            </thead>
            <tbody>
                {rows}
            </tbody>
        </Table>
    );
}