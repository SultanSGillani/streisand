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
import UpdateReleaseView from '../../components/releases/UpdateReleaseView';

export type Props = {
    params: {
        mode: string;
        releaseId: string;
    };
};

type ConnectedState = {
    film?: IFilm;
    releaseId: number;
    release?: IRelease;
    isEditMode: boolean;
    status: ILoadingStatus;
};

type ConnectedDispatch = {
    getMediaTypes: () => void;
    getRelease: (id: number) => void;
};

type CombinedProps = ConnectedState & ConnectedDispatch & Props;
class ReleasePageComponent extends React.Component<CombinedProps, void> {
    public componentWillMount() {
        if (!this.props.status.loading) {
            this.props.getRelease(this.props.releaseId);
        }
        this.props.getMediaTypes();
    }

    public componentWillReceiveProps(props: CombinedProps) {
        const status = props.status;
        const changed = props.releaseId !== this.props.releaseId;
        const needUpdate = !status.failed && (!status.loaded || status.outdated);
        if (!status.loading && (changed || needUpdate)) {
            this.props.getRelease(props.releaseId);
        }
    }

    public render() {
        const { film, release } = this.props;
        if (!release || !film) {
            return this.props.status.loading ? <Loading /> : <Empty />;
        }

        if (this.props.isEditMode) {
            return (
                <UpdateReleaseView film={film} release={release} />
            );
        }

        return (
            <ReleaseView film={film} release={release} />
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
        isEditMode: props.params.mode === 'edit'
    };
};

const mapDispatchToProps = (dispatch: IDispatch): ConnectedDispatch => ({
    getMediaTypes: () => dispatch(getMediaTypes()),
    getRelease: (id: number) => dispatch(getRelease(id))
});

const ReleasePage: React.ComponentClass<Props> =
    connect(mapStateToProps, mapDispatchToProps)(ReleasePageComponent);
export default ReleasePage;
