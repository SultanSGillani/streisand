import * as React from 'react';
import { connect } from 'react-redux';

import Store from '../../store';
import IFilm from '../../models/IFilm';
import ITorrent from '../../models/ITorrent';
import TorrentSection from '../torrents/TorrentSection';
import TorrentModal from '../torrents/TorrentModal';

export type Props = {
    film: IFilm;
    torrentId: number;
};

type ConnectedState = {
    torrents: ITorrent[];
    loadingTorrents: boolean;
};
type ConnectedDispatch = {};

type CombinedProps = Props & ConnectedDispatch & ConnectedState;
class FilmViewComponent extends React.Component<CombinedProps> {
    public render() {
        const film = this.props.film;
        const trailerId = getYouTubeId(film.trailerUrl);
        const youtubeUrl = `//www.youtube.com/embed/${trailerId}?rel=0&amp;wmode=transparent`;
        const tags = film.tags.map((tag: string) => {
            return (<span className="label label-default" key={tag}>{tag}</span>);
        });
        return (
            <div>
                <h1>{film.title}  [{film.year}]</h1>
                <div className="col-lg-8">
                    <div className="row">
                        <iframe width="620" height="350" src={youtubeUrl} frameBorder="0"></iframe>
                    </div>
                    <div className="row">
                        <h2>Description</h2>
                        <p>{film.description}</p>
                        <div>{tags}</div>
                    </div>
                    <div className="row">
                        <h2>Torrents</h2>
                        <TorrentSection torrents={this.props.torrents} />
                    </div>
                </div>
                <div className="col-lg-3 col-lg-offset-1">
                    <img src={film.posterUrl} width="250px" />
                </div>
                {this._getModal()}
            </div>
        );
    }

    private _getModal() {
        const torrent = this._getTorrent(this.props.torrentId);
        return !torrent ? undefined :
            <TorrentModal film={this.props.film} torrent={torrent} />;
    }

    private _getTorrent(torrentId: number) {
        for (const torrent of this.props.torrents) {
            if (torrent.id === torrentId) {
                return torrent;
            }
        }
    }
}

const mapStateToProps = (state: Store.All, ownProps: Props): ConnectedState => {
    const page = state.sealed.torrents.byFilmId[ownProps.film.id];
    return {
        torrents: page ? page.items || [] : [],
        loadingTorrents: page ? page.loading : false
    };
};

const FilmView: React.ComponentClass<Props> =
    connect(mapStateToProps)(FilmViewComponent);
export default FilmView;

function getYouTubeId(url: string) {
    // TODO: server should return the youtube id so we don't have to parse it client side
    return url.substring(url.lastIndexOf('v=') + 2);
}