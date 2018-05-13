import * as React from 'react';
import { Link } from 'react-router';

import ITorrent from '../../models/ITorrent';

export type Props = {
    torrents: ITorrent[];
};

export default function TorrentList(props: Props) {
    const torrents = props.torrents;
    const rows = torrents.map((torrent: ITorrent) => {
        return (<TorrentRow torrent={torrent} key={torrent.id} />);
    });

    return (
        <table className="table table-striped table-hover">
            <thead>
                <tr>
                    <th>Release Name</th>
                    <th>Resolution</th>
                    <th>Source</th>
                    <th>Size</th>
                </tr>
            </thead>
            <tbody>
                {rows}
            </tbody>
        </table>
    );
}

function TorrentRow(props: { torrent: ITorrent }) {
    const torrent = props.torrent;
    const name = torrent.releaseName || '<Uknown>';
    const url = `/film/${torrent.filmId}/${torrent.id}`;

    return (
        <tr>
            <td className="align-middle">
                <Link to={url} title={name}>{name}</Link>
            </td>
            <td className="align-middle">{torrent.resolution}</td>
            <td className="align-middle">{torrent.sourceMedia}</td>
            <td className="align-middle">{torrent.size}</td>
        </tr>
    );
}