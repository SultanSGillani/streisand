import * as React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import Store from '../../store';
import IFilm from '../../models/IFilm';
import IRelease, { IReleaseUpdate } from '../../models/IRelease';
import IMediaTypes from '../../models/IMediaTypes';
import CommandBar, { ICommand } from '../CommandBar';
import { IDispatch } from '../../state/actions/ActionTypes';
import ReleaseForm, { IReleaseFormData } from './ReleaseForm';
import { deleteRelease } from '../../actions/releases/DeleteReleaseAction';
import { getNodeItems } from '../../utilities/mapping';
import { ITorrent } from '../../models/ITorrent';
import { updateRelease } from '../../actions/releases/UpdateReleaseAction';
import TorrentSection from '../torrents/TorrentSection';

export type Props = {
    film: IFilm;
    release: IRelease;
    torrentId?: number;
};

type State = {
    editMode: boolean;
};

type ConnectedState = {
    torrents: ITorrent[];
    mediaTypes: IMediaTypes;
};

type ConnectedDispatch = {
    editRelease: (id: number) => void;
    deleteRelease: (id: number) => void;
    updateRelease: (id: number, release: IReleaseUpdate) => void;
};

type CombinedProps = Props & ConnectedDispatch & ConnectedState;
class ReleaseViewComponent extends React.Component<CombinedProps, State> {
    constructor(props: CombinedProps) {
        super(props);

        this.state = {
            editMode: false
        };
    }

    public render() {
        const { film, release, torrents, mediaTypes } = this.props;
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

        if (this.state.editMode) {
            const onCancel = () => this.setState({ editMode: false });
            const onSubmit = (data: IReleaseFormData) => {
                this.props.updateRelease(release.id, {
                    filmId: film.id,
                    ...data
                });
            };

            return (
                <div>
                    <h1>{film.title} [{film.year}]</h1>
                    <ReleaseForm intialValues={data} mediaTypes={mediaTypes} processing={false}
                        onSubmit={onSubmit} onCancel={onCancel} />
                </div>
            );
        }

        const commands: ICommand[] = [
            {
                label: 'Edit',
                onExecute: () => { this.setState({ editMode: true }); }
            }, {
                label: 'Delete',
                status: 'danger',
                onExecute: () => { this.props.deleteRelease(release.id); }
            }
        ];

        const torrentSection = !torrents.length ? undefined : (
            <>
                <h2 className="mt-3">Torrents</h2>
                <TorrentSection film={film}
                    torrents={this.props.torrents} includeReleaseInfo={false}
                    selected={this.props.torrentId} urlPrefix={`/release/${release.id}`} />
            </>
        );

        return (
            <div>
                <CommandBar commands={commands} />
                <h1>Film Release</h1>
                <Link to={`/film/${film.id}`}>
                    <p className="text-center">{film.title} [{film.year}]</p>
                </Link>
                <ReleaseForm intialValues={data} mediaTypes={mediaTypes} processing={false} />
                {torrentSection}
            </div>
        );
    }
}

const mapStateToProps = (state: Store.All, props: Props): ConnectedState => {
    const list = state.sealed.torrent.byReleaseId[props.release.id];
    return {
        mediaTypes: state.mediaTypes,
        torrents: getNodeItems({
            page: 1,
            byId: state.sealed.torrent.byId,
            pages: list.pages
        })
    };
};

const mapDispatchToProps = (dispatch: IDispatch): ConnectedDispatch => ({
    deleteRelease: (id: number) => dispatch(deleteRelease({ id })),
    editRelease: (id: number) => dispatch(push(`/release/${id}/edit`)),
    updateRelease: (id: number, release: IReleaseUpdate) => dispatch(updateRelease(id, release))
});

const ReleaseView: React.ComponentClass<Props> =
    connect(mapStateToProps, mapDispatchToProps)(ReleaseViewComponent);
export default ReleaseView;