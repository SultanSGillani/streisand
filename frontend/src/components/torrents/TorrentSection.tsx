import * as React from 'react';
import { Table } from 'reactstrap';
import { Link } from 'react-router';

import ITorrent from '../../models/ITorrent';

export type Props = {
    torrents: ITorrent[];
};

export default function TorrentSection(props: Props) {
    const torrents = props.torrents;
    const rows = torrents.map((torrent: ITorrent) => {
        return (<TorrentRow torrent={torrent} key={torrent.id} />);
    });

    return (
        <Table className="table-borderless" striped hover>
            <thead>
                <tr>
                    <th></th>
                    <th>Size</th>
                    <th>Snatched</th>
                </tr>
            </thead>
            <tbody>
                {rows}
            </tbody>
        </Table>
    );
}

function TorrentRow(props: { torrent: ITorrent }) {
    const torrent = props.torrent;
    const url = `/film/${torrent.filmId}/${torrent.id}`;

    let name = `${torrent.codec} / ${torrent.container} / ${torrent.sourceMedia} / ${torrent.resolution}`;
    if (torrent.isScene) {
        name += ' / Scene';
    }

    return (
        <tr>
            <td className="align-middle">
                <Link to={url} title={name}>{name}</Link>
            </td>
            <td className="align-middle">{torrent.size}</td>
            <td className="align-middle">{torrent.snatchCount}</td>
        </tr>
    );
}