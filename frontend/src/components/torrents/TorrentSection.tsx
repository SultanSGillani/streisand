import * as React from 'react';
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
        <table className="table table-striped table-hover">
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
        </table>
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
            <td>
                <Link to={url} title={name}>{name}</Link>
            </td>
            <td>{torrent.size}</td>
            <td>{torrent.snatchCount}</td>
        </tr>
    );
}