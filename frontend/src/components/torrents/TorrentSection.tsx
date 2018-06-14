import * as React from 'react';
import { Table, Button } from 'reactstrap';
import { Link } from 'react-router';

import ITorrent from '../../models/ITorrent';
import { getSize } from '../../utilities/dataSize';
import globals from '../../utilities/globals';
import IFilm from '../../models/IFilm';

export type Props = {
    film: IFilm;
    torrents: ITorrent[];
};

export default function TorrentSection(props: Props) {
    const { torrents, film } = this.props;
    if (!torrents.length) {
        return <p>There are no torrents uploaded for this film yet.</p>;
    }

    const rows = torrents.map((torrent: ITorrent) => {
        return (<TorrentRow film={film} torrent={torrent} key={torrent.id} />);
    });

    return (
        <Table className="table-borderless" striped hover>
            <thead>
                <tr>
                    <th>Torrent</th>
                    <th>Size</th>
                    <th>Snatched</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {rows}
            </tbody>
        </Table>
    );
}

function TorrentRow(props: { film: IFilm, torrent: ITorrent }) {
    const { film, torrent } = props;
    if (!torrent.release) {
        return <div style={{ marginTop: '8px' }}>Release is not tied to a torrent.</div>;
    }
    const url = `/film/${film.id}/${torrent.id}`;

    let name = `${torrent.release.codec} / ${torrent.release.container} / ${torrent.release.sourceMedia} / ${torrent.release.resolution}`;
    if (!name) {
        return <tbody style={{ marginTop: '8px' }}>Release is not tied to a torrent.</tbody>;
    }
    if (torrent.release.isScene) {
        name += ' / Scene';
    }

    const size = getSize(torrent.totalSizeInBytes);
    const onDownload = () => location.href = `${globals.baseUrl}${torrent.downloadUrl}`;
    return (
        <tr>
            <td className="align-middle">
                <Link to={url} title={name}>{name}</Link>
            </td>
            <td className="align-middle">{size}</td>
            <td className="align-middle">{torrent.snatchCount}</td>
            <td>
            <div className="row m-0 justify-content-end">
                <Button className="col-auto" size="sm" title="Download torrent file" onClick={onDownload}>
                    <i className="fas fa-arrow-down fa-lg" />
                </Button>
            </div>
        </td>
        </tr>
    );
}
