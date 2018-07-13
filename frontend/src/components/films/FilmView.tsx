import * as React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import Store from '../../store';
import IFilm from '../../models/IFilm';
import ITorrent from '../../models/ITorrent';
import CommandBar, { ICommand } from '../CommandBar';
import { IDispatch } from '../../actions/ActionTypes';
import { getNodeItems } from '../../utilities/mapping';
import TorrentSection from '../torrents/TorrentSection';
import CommentSection from '../comments/CommentSection';
import { deleteFilm } from '../../actions/films/DeleteFilmAction';
import { createComment } from '../../actions/comments/CreateCommentAction';

export type Props = {
    film: IFilm;
    torrentId?: number;
};

type ConnectedState = {
    torrents: ITorrent[];
};

type ConnectedDispatch = {
    editFilm: (id: number) => void;
    deleteFilm: (id: number) => void;
    uploadTorrent: (id: number) => void;
    createComment: (film: number, text: string) => void;
};

const styles: { [key: string]: any } = {
    videoContainer: { height: '350px', position: 'relative' },
    video: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%'
    }
};

type CombinedProps = Props & ConnectedDispatch & ConnectedState;
class FilmViewComponent extends React.Component<CombinedProps> {
    public render() {
        const film = this.props.film;
        const trailerId = getYouTubeId(film.trailerUrl);
        const youtubeUrl = `//www.youtube.com/embed/${trailerId}?rel=0&amp;wmode=transparent`;
        const tags = film.genreTags.map((tag: string) => {
            return (<span className="badge badge-secondary" key={tag}>{tag}</span>);
        });
        const commands: ICommand[] = [
            {
                label: 'Upload torrent',
                onExecute: () => { this.props.uploadTorrent(film.id); }
            }, {
                label: 'Edit',
                onExecute: () => { this.props.editFilm(film.id); }
            }, {
                label: 'Delete',
                status: 'danger',
                onExecute: () => { this.props.deleteFilm(film.id); }
            }, {
                label: 'Comment',
                onExecute: () => {
                    this.props.createComment(film.id, 'Something');
                }
            }
        ];
        const urlPrefix = `/film/${film.id}`;
        return (
            <>
                <CommandBar commands={commands} />
                <h1>{film.title} [{film.year}]</h1>
                <div style={styles.videoContainer}>
                    <iframe style={styles.video} src={youtubeUrl} frameBorder="0"></iframe>
                </div>
                <h2>Description</h2>
                <>{tags}</>
                <p>{film.description}</p>
                <h2>Torrents</h2>
                <TorrentSection film={film}
                    torrents={this.props.torrents} includeReleaseInfo={true}
                    selected={this.props.torrentId} urlPrefix={urlPrefix} />
                <CommentSection film={film} />
            </>
        );
    }
}

const mapStateToProps = (state: Store.All, props: Props): ConnectedState => {
    const list = state.sealed.torrent.byFilmId[props.film.id];
    return {
        torrents: getNodeItems({
            page: 1,
            byId: state.sealed.torrent.byId,
            pages: list.pages
        })
    };
};

const mapDispatchToProps = (dispatch: IDispatch): ConnectedDispatch => ({
    deleteFilm: (id: number) => dispatch(deleteFilm({ id })),
    editFilm: (id: number) => dispatch(push(`/film/${id}/edit`)),
    uploadTorrent: (id: number) => dispatch(push(`/torrents/upload/${id}`)),
    createComment: (film: number, text: string) => dispatch(createComment({ film, text }))
});

const FilmView: React.ComponentClass<Props> =
    connect(mapStateToProps, mapDispatchToProps)(FilmViewComponent);
export default FilmView;

function getYouTubeId(url: string) {
    // TODO: server should return the youtube id so we don't have to parse it client side
    return url.substring(url.lastIndexOf('v=') + 2);
}
