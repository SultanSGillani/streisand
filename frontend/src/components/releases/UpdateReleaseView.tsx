import * as React from 'react';
import { connect } from 'react-redux';

import Store from '../../store';
import IFilm from '../../models/IFilm';
import IMediaTypes from '../../models/IMediaTypes';
import { IDispatch } from '../../actions/ActionTypes';
import ReleaseForm, { IReleaseFormData } from './ReleaseForm';
import IRelease, { IReleaseUpdate } from '../../models/IRelease';
import { updateRelease } from '../../actions/releases/UpdateReleaseAction';

export type Props = {
    film: IFilm;
    release: IRelease;
};

type ConnectedState = {
    mediaTypes: IMediaTypes;
};

type ConnectedDispatch = {
    updateRelease: (id: number, release: IReleaseUpdate) => void;
};

type CombinedProps = Props & ConnectedDispatch & ConnectedState;
class UpdateReleaseViewComponent extends React.Component<CombinedProps> {
    public render() {
        const { film, release, mediaTypes } = this.props;
        const data: IReleaseFormData = {
            codec: release.codec,
            container: release.container,
            cut: release.cut,
            description: release.description,
            is3d: release.is3d,
            isScene: release.isScene,
            isSource: release.isSource,
            nfo: release.nfo,
            releaseGroup: release.releaseGroup,
            releaseName: release.releaseName,
            resolution: release.resolution,
            sourceMedia: release.sourceMedia
        };
        const onSubmit = (data: IReleaseFormData) => {
            this.props.updateRelease(release.id, {
                filmId: film.id,
                ...data
            });
        };
        return (
            <div>
                <h1>{film.title} [{film.year}]</h1>
                <ReleaseForm intialValues={data} mediaTypes={mediaTypes} onSubmit={onSubmit} processing={false} />
            </div>
        );
    }
}

const mapStateToProps = (state: Store.All, props: Props): ConnectedState => {
    return {
        mediaTypes: state.mediaTypes
    };
};

const mapDispatchToProps = (dispatch: IDispatch): ConnectedDispatch => ({
    updateRelease: (id: number, release: IReleaseUpdate) => dispatch(updateRelease(id, release))
});

const UpdateReleaseView: React.ComponentClass<Props> =
    connect(mapStateToProps, mapDispatchToProps)(UpdateReleaseViewComponent);
export default UpdateReleaseView;