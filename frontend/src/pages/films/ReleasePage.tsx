import * as React from 'react';
import { connect } from 'react-redux';

import Store from '../../store';
import IFilm from '../../models/IFilm';
import IRelease from '../../models/IRelease';
import { getNode } from '../../utilities/mapping';
import Empty from '../../components/generic/Empty';
import { IDispatch } from '../../actions/ActionTypes';
import Loading from '../../components/generic/Loading';
import { numericIdentifier } from '../../utilities/shim';
import ILoadingStatus from '../../models/base/ILoadingStatus';
import { getMediaTypes } from '../../actions/MediaTypeAction';
import ReleaseView from '../../components/releases/ReleaseView';
import { getRelease } from '../../actions/releases/ReleaseAction';
import { getTorrents } from '../../actions/torrents/ReleaseTorrentsAction';

export type Props = {
    params: {
        releaseId: string;
        torrentId: string;
    };
};

type ConnectedState = {
    film?: IFilm;
    releaseId: number;
    torrentId: number;
    release?: IRelease;
    status: ILoadingStatus;
};

type ConnectedDispatch = {
    getMediaTypes: () => void;
    getRelease: (id: number) => void;
    getTorrents: (id: number) => void;
};

type CombinedProps = ConnectedState & ConnectedDispatch & Props;
class ReleasePageComponent extends React.Component<CombinedProps, void> {
    public componentWillMount() {
        if (!this.props.status.loading) {
            this.props.getRelease(this.props.releaseId);
            this.props.getTorrents(this.props.releaseId);
        }
        this.props.getMediaTypes();
    }

    public componentWillReceiveProps(props: CombinedProps) {
        const status = props.status;
        const changed = props.releaseId !== this.props.releaseId;
        const needUpdate = !status.failed && (!status.loaded || status.outdated);
        if (!status.loading && (changed || needUpdate)) {
            props.getRelease(props.releaseId);
            props.getTorrents(props.releaseId);
        }
    }

    public render() {
        const { film, release } = this.props;
        if (!release || !film) {
            return this.props.status.loading ? <Loading /> : <Empty />;
        }

        return (
            <ReleaseView film={film} release={release} torrentId={this.props.torrentId} />
        );
    }
}

const mapStateToProps = (state: Store.All, props: Props): ConnectedState => {
    const releaseId = numericIdentifier(props.params.releaseId);
    const releaseNode = getNode({ id: releaseId, byId: state.sealed.release.byId });
    const filmNode = releaseNode.item && getNode({ id: releaseNode.item.film, byId: state.sealed.film.byId });
    return {
        releaseId: releaseId,
        release: releaseNode.item,
        status: releaseNode.status,
        film: filmNode && filmNode.item,
        torrentId: numericIdentifier(props.params.torrentId)
    };
};

const mapDispatchToProps = (dispatch: IDispatch): ConnectedDispatch => ({
    getMediaTypes: () => dispatch(getMediaTypes()),
    getRelease: (id: number) => dispatch(getRelease(id)),
    getTorrents: (id: number) => dispatch(getTorrents(id))
});

const ReleasePage: React.ComponentClass<Props> =
    connect(mapStateToProps, mapDispatchToProps)(ReleasePageComponent);
export default ReleasePage;
