import * as React from 'react';
import { connect } from 'react-redux';

import Store from '../../store';
import IFilm from '../../models/IFilm';
import { getNode } from '../../utilities/mapping';
import Empty from '../../components/generic/Empty';
import { IDispatch } from '../../actions/ActionTypes';
import Loading from '../../components/generic/Loading';
import FilmView from '../../components/films/FilmView';
import { numericIdentifier } from '../../utilities/shim';
import { getFilm } from '../../actions/films/FilmAction';
import ILoadingStatus from '../../models/base/ILoadingStatus';
import { getTorrents } from '../../actions/torrents/FilmTorrentsAction';
import UpdateFilmView from '../../components/films/UpdateFilmView';

export type Props = {
    params: {
        filmId: string;
        torrentId: string;
    };
};

type ConnectedState = {
    film?: IFilm;
    filmId: number;
    torrentId: number;
    isEditMode: boolean;
    status: ILoadingStatus;
};

type ConnectedDispatch = {
    getFilm: (id: number) => void;
    getTorrents: (filmId: number) => void;
};

type CombinedProps = ConnectedState & ConnectedDispatch & Props;
class FilmPageComponent extends React.Component<CombinedProps, void> {
    public componentWillMount() {
        if (!this.props.status.loading) {
            this.props.getFilm(this.props.filmId);
            this.props.getTorrents(this.props.filmId);
        }
    }

    public componentWillReceiveProps(props: CombinedProps) {
        const status = props.status;
        const changed = props.filmId !== this.props.filmId;
        const needUpdate = !status.failed && (!status.loaded || status.outdated);
        if (!status.loading && (changed || needUpdate)) {
            this.props.getFilm(props.filmId);
            this.props.getTorrents(props.filmId);
        }
    }

    public render() {
        const film = this.props.film;
        if (!film) {
            return this.props.status.loading ? <Loading /> : <Empty />;
        }

        if (this.props.isEditMode) {
            return (
                <UpdateFilmView film={film} />
            );
        }

        return (
            <FilmView film={film} torrentId={this.props.torrentId} />
        );
    }
}

const mapStateToProps = (state: Store.All, props: Props): ConnectedState => {
    const filmId = numericIdentifier(props.params.filmId);
    const node = getNode({ id: filmId, byId: state.sealed.film.byId });
    return {
        filmId: filmId,
        film: node.item,
        status: node.status,
        isEditMode: props.params.torrentId === 'edit',
        torrentId: numericIdentifier(props.params.torrentId)
    };
};

const mapDispatchToProps = (dispatch: IDispatch): ConnectedDispatch => ({
    getFilm: (id: number) => dispatch(getFilm(id)),
    getTorrents: (filmId: number) => dispatch(getTorrents(filmId))
});

const FilmPage: React.ComponentClass<Props> =
    connect(mapStateToProps, mapDispatchToProps)(FilmPageComponent);
export default FilmPage;
