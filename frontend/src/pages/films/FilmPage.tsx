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
import { getTorrents } from '../../actions/torrents/FilmTorrentsAction';

export type Props = {
    params: {
        filmId: string;
        torrentId: string;
    };
};

type ConnectedState = {
    filmId: number;
    torrentId: number;
    film?: IFilm;
    loading: boolean;
};

type ConnectedDispatch = {
    getFilm: (id: number) => void;
    getTorrents: (filmId: number) => void;
};

type CombinedProps = ConnectedState & ConnectedDispatch & Props;
class FilmPageComponent extends React.Component<CombinedProps, void> {
    public componentWillMount() {
        if (!this.props.loading) {
            this.props.getFilm(this.props.filmId);
            this.props.getTorrents(this.props.filmId);
        }
    }

    public componentWillReceiveProps(props: CombinedProps) {
        if (!props.loading && props.params.filmId !== this.props.params.filmId) {
            this.props.getFilm(props.filmId);
            this.props.getTorrents(props.filmId);
        }
    }

    public render() {
        const film = this.props.film;
        if (!film) {
            return this.props.loading ? <Loading /> : <Empty />;
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
        film: node.item,
        loading: node.status.loading,
        filmId: numericIdentifier(props.params.filmId),
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
