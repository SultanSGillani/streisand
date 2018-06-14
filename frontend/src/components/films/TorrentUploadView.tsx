import * as React from 'react';
import { connect } from 'react-redux';
import { Button, Card, CardBody, Form, CardFooter } from 'reactstrap';

import Store from '../../store';
import IFilm from '../../models/IFilm';
import IRelease from '../../models/IRelease';
import { ITorrent } from '../../models/ITorrent';
import { getNode } from '../../utilities/mapping';
import { IDispatch } from '../../actions/ActionTypes';
import { StringInput, BooleanInput } from '../generic/inputs';
import { uploadTorrent } from '../../actions/torrents/UploadTorrentAction';
import { createRelease, IActionProps as IReleaseProps } from '../../actions/releases/CreateReleaseAction';
import { attachToRelease, IActionProps as ITorrentProps } from '../../actions/torrents/UpdateTorrentAction';

export type Props = {
    film: IFilm;
};

type ReleaseData = {
    description: string;
    cut: string;
    codec: string;
    container: string;
    resolution: string;
    sourceMedia: string;
    isScene: boolean;
    isSource: boolean;
    is3d: boolean;
    nfo: string;
    releaseGroup: string;
    releaseName: string;
};

type State = {
    file?: File;
    torrentId?: number;
    releaseId?: number;
    data: ReleaseData;
};

type ConnectedState = {
    getTorrent: (id: number) => ITorrent | undefined;
    getRelease: (id: number) => IRelease | undefined;
};

type ConnectedDispatch = {
    uploadTorrent: (file: File, finished: (id: number) => void) => void;
    createRelease: (props: IReleaseProps) => void;
    attachToRelease: (props: ITorrentProps) => void;
};

type CombinedProps = Props & ConnectedDispatch & ConnectedState;
class TorrentUploadViewComponent extends React.Component<CombinedProps, State> {
    constructor(props: CombinedProps) {
        super(props);

        this.state = {
            data: {
                description: '',
                cut: 'Theatrical',
                codec: 'XviD',
                container: 'AVI',
                resolution: 'Standard Def',
                sourceMedia: 'DVD',
                isScene: false,
                isSource: false,
                is3d: false,
                nfo: '',
                releaseGroup: '',
                releaseName: ''
            }
        };
    }

    public render() {
        const film = this.props.film;
        // const torrent = this.state.torrentId && this.props.getTorrent(this.state.torrentId);
        // const release = this.state.releaseId && this.props.getRelease(this.state.releaseId);

        return (
            <div>
                <h1>Torrent upload</h1>
                <h3>{film.title} [{film.year}]</h3>
                {this._getFileUpload()}
                {this._getCreationCard()}
            </div>
        );
    }

    private _getFileUpload() {
        const torrentFile = this.state.file;
        const uploadTorrent = () => {
            if (this.state.file) {
                this.props.uploadTorrent(this.state.file, (id: number) => {
                    this.setState({ torrentId: id });
                });
            }
        };
        const label = torrentFile ? torrentFile.name : 'Choose file';
        const canUpload = !!torrentFile && !this.state.torrentId;
        return (
            <div className="input-group mt-3">
                <div className="custom-file">
                    <input type="file" className="custom-file-input" id="torrentFileInput" accept=".torrent" onChange={(event) => {
                        if (event.target.files && event.target.files.length) {
                            const file = event.target.files[0];
                            this.setState({ file });
                        }
                    }} />
                    <label className="custom-file-label" htmlFor="torrentFileInput">{label}</label>
                </div>
                <div className="input-group-append">
                    <Button color="primary" disabled={!canUpload} onClick={uploadTorrent}>Upload</Button>
                </div>
            </div>
        );
    }

    private _setDataState<K extends keyof ReleaseData>(state: Pick<ReleaseData, K>) {
        this.setState({
            data: {
                ...this.state.data,
                ...state as object
            }
        });
    }

    private _getCreationCard() {
        if (!this.state.torrentId) {
            return undefined;
        }

        const data = this.state.data;
        const canCreateRelease = this._canCreateRelease();
        const onCreateRelease = this._createRelease.bind(this);
        return (
            <Card className="mt-3">
                <CardBody>
                    <Form onKeyPress={onCreateRelease} autoComplete="off">
                        <StringInput id="releaseGroup" label="Release group"
                            placeholder="Film release group" value={data.releaseGroup}
                            setValue={(value: string) => this._setDataState({ releaseGroup: value })} />
                        <StringInput id="releaseName" label="Release name"
                            placeholder="Film release name" value={data.releaseName}
                            setValue={(value: string) => this._setDataState({ releaseName: value })} />
                        <StringInput id="description" label="Description"
                            placeholder="Film release description" value={data.description}
                            setValue={(value: string) => this._setDataState({ description: value })} />
                        <StringInput id="cut" label="Cut" placeholder="Film release cut" value={data.cut}
                            setValue={(value: string) => this._setDataState({ cut: value })} />
                        <StringInput id="codec" label="Codec"
                            placeholder="Film release codec" value={data.codec}
                            setValue={(value: string) => this._setDataState({ codec: value })} />
                        <StringInput id="container" label="Container"
                            placeholder="Film release container" value={data.container}
                            setValue={(value: string) => this._setDataState({ container: value })} />
                        <StringInput id="resolution" label="Resolution"
                            placeholder="Film release resolution" value={data.resolution}
                            setValue={(value: string) => this._setDataState({ resolution: value })} />
                        <StringInput id="sourceMedia" label="Source media"
                            placeholder="Film release source media" value={data.sourceMedia}
                            setValue={(value: string) => this._setDataState({ sourceMedia: value })} />
                        <StringInput id="nfo" label="NFO" placeholder="Film release nfo" value={data.nfo}
                            setValue={(value: string) => this._setDataState({ nfo: value })} />
                        <BooleanInput id="isScene" label="Scene" value={data.isScene}
                            setValue={(value: boolean) => this._setDataState({ isScene: value })} />
                        <BooleanInput id="isSource" label="Source" value={data.isSource}
                            setValue={(value: boolean) => this._setDataState({ isSource: value })} />
                        <BooleanInput id="is3d" label="3D" value={data.is3d}
                            setValue={(value: boolean) => this._setDataState({ is3d: value })} />
                    </Form>
                </CardBody>
                <CardFooter>
                    <div className="row m-0 justify-content-end">
                        <Button className="col-auto" color="primary" disabled={!canCreateRelease} onClick={() => onCreateRelease()}>Create</Button>
                    </div>
                </CardFooter>
            </Card>
        );
    }

    private _canCreateRelease() {
        const {
            description,
            cut,
            codec,
            container,
            resolution,
            sourceMedia,
            nfo,
            releaseGroup,
            releaseName
        } = this.state.data;
        return !!(description && cut && codec && container
            && resolution && sourceMedia && nfo && releaseGroup && releaseName);
    }

    private _createRelease(event?: React.KeyboardEvent<HTMLElement>) {
        if (event && event.key !== 'Enter') {
            return;
        }

        if (this.state.torrentId && this._canCreateRelease()) {
            this.props.createRelease({
                finished: (id: number) => {
                    this.setState({ releaseId: id });
                    if (this.state.torrentId) {
                        this.props.attachToRelease({
                            filmId: this.props.film.id,
                            releaseId: id,
                            id: this.state.torrentId
                        });
                    }
                },
                data: {
                    filmId: this.props.film.id,
                    ...this.state.data
                }
            });
        }
        return false;
    }
}

const mapStateToProps = (state: Store.All, props: Props): ConnectedState => {
    const releases = state.sealed.release.byId;
    const torrents = state.sealed.torrent.byId;
    return {
        getTorrent: (id: number) => {
            return getNode({ byId: torrents, id }).item;
        },
        getRelease: (id: number) => {
            return getNode({ byId: releases, id }).item;
        }
    };
};

const mapDispatchToProps = (dispatch: IDispatch): ConnectedDispatch => ({
    uploadTorrent: (file: File, finished: (id: number) => void) => dispatch(uploadTorrent(file, finished)),
    createRelease: (props: IReleaseProps) => dispatch(createRelease(props)),
    attachToRelease: (props: ITorrentProps) => dispatch(attachToRelease(props))
});

const TorrentUploadView: React.ComponentClass<Props> =
    connect(mapStateToProps, mapDispatchToProps)(TorrentUploadViewComponent);
export default TorrentUploadView;
