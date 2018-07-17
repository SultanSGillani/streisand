import * as React from 'react';
import { connect } from 'react-redux';

import Store from '../../state/store';
import IFilm from '../../models/IFilm';
import { getNode } from '../../utilities/mapping';
import Empty from '../../components/generic/Empty';
import Loading from '../../components/generic/Loading';
import { numericIdentifier } from '../../utilities/shim';
import { IDispatch } from '../../state/actions/ActionTypes';
import ILoadingStatus from '../../models/base/ILoadingStatus';
import { getFilm } from '../../state/film/actions/FilmAction';
import TorrentUploadView from '../../components/films/TorrentUploadView';
import { getMediaTypes } from '../../state/mediaTypes/actions/MediaTypeAction';

export type Props = {
    params: {
        filmId: string;
    };
};

type ConnectedState = {
    filmId: number;
    film?: IFilm;
    status: ILoadingStatus;
};

type ConnectedDispatch = {
    getFilm: (id: number) => void;
    getMediaTypes: () => void;
};

type CombinedProps = ConnectedState & ConnectedDispatch & Props;
class TorrentUploadPageComponent extends React.Component<CombinedProps> {
    public componentWillMount() {
        if (!this.props.status.loading) {
            this.props.getFilm(this.props.filmId);
        }
        this.props.getMediaTypes();
    }

    public componentWillReceiveProps(props: CombinedProps) {
        const status = props.status;
        const changed = props.filmId !== this.props.filmId;
        const needUpdate = !status.failed && (!status.loaded || status.outdated);
        if (!status.loading && (changed || needUpdate)) {
            this.props.getFilm(props.filmId);
        }
    }

    public render() {
        const film = this.props.film;
        if (!film) {
            return this.props.status.loading ? <Loading /> : <Empty />;
        }

        return (
            <TorrentUploadView film={film} />
        );
    }
}

const mapStateToProps = (state: Store.All, props: Props): ConnectedState => {
    const filmId = numericIdentifier(props.params.filmId);
    const node = getNode({ id: filmId, byId: state.sealed.film.byId });
    return {
        filmId: filmId,
        film: node.item,
        status: node.status
    };
};

const mapDispatchToProps = (dispatch: IDispatch): ConnectedDispatch => ({
    getMediaTypes: () => dispatch(getMediaTypes()),
    getFilm: (id: number) => dispatch(getFilm(id))
});

const TorrentUploadPage: React.ComponentClass<Props> =
    connect(mapStateToProps, mapDispatchToProps)(TorrentUploadPageComponent);
export default TorrentUploadPage;