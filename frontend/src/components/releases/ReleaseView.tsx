import * as React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import Store from '../../store';
import IFilm from '../../models/IFilm';
import IRelease from '../../models/IRelease';
import IMediaTypes from '../../models/IMediaTypes';
import CommandBar, { ICommand } from '../CommandBar';
import { IDispatch } from '../../actions/ActionTypes';
import ReleaseForm, { IReleaseFormData } from './ReleaseForm';
import { deleteRelease } from '../../actions/releases/DeleteReleaseAction';

export type Props = {
    film: IFilm;
    release: IRelease;
};

type ConnectedState = {
    mediaTypes: IMediaTypes;
};

type ConnectedDispatch = {
    editRelease: (id: number) => void;
    deleteRelease: (id: number) => void;
};

type CombinedProps = Props & ConnectedDispatch & ConnectedState;
class ReleaseViewComponent extends React.Component<CombinedProps> {
    public render() {
        const { film, release, mediaTypes } = this.props;
        const commands: ICommand[] = [
            {
                label: 'Edit',
                onExecute: () => { this.props.editRelease(release.id); }
            }, {
                label: 'Delete',
                status: 'danger',
                onExecute: () => { this.props.deleteRelease(release.id); }
            }
        ];

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
        return (
            <div>
                <CommandBar commands={commands} />
                <h1>{film.title} [{film.year}]</h1>
                <ReleaseForm intialValues={data} mediaTypes={mediaTypes} processing={false} />
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
    deleteRelease: (id: number) => dispatch(deleteRelease({ id })),
    editRelease: (id: number) => dispatch(push(`/release/${id}/edit`))
});

const ReleaseView: React.ComponentClass<Props> =
    connect(mapStateToProps, mapDispatchToProps)(ReleaseViewComponent);
export default ReleaseView;