import * as React from 'react';
import { Button, Card, CardBody, Form, CardFooter } from 'reactstrap';
import { connect } from 'react-redux';

import Store from '../../store';
import IFilm from '../../models/IFilm';
import IRelease from '../../models/IRelease';
import { StringInput } from '../generic/inputs';
import { ITorrent } from '../../models/ITorrent';
import { getNode } from '../../utilities/mapping';
import { IDispatch } from '../../actions/ActionTypes';
import { uploadTorrent } from '../../actions/torrents/UploadTorrentAction';
import { createRelease, IActionProps as IReleaseProps } from '../../actions/releases/CreateReleaseAction';
import { attachToRelease, IActionProps as ITorrentProps } from '../../actions/torrents/UpdateTorrentAction';

export type Props = {
    film: IFilm;
};

type State = {
    file?: File;
    torrentId?: number;
    releaseId?: number;
    description: string;
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
            description: ''
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

    private _getCreationCard() {
        if (!this.state.torrentId) {
            return undefined;
        }
        const onCreateTorrent = this._createTorrent.bind(this);
        return (
            <Card className="mt-3">
                <CardBody>
                    <Form onKeyPress={onCreateTorrent} autoComplete="off">
                        <StringInput id="description" label="Description" placeholder="torrent description"
                            value={this.state.description} setValue={(value: string) => this.setState({ description: value })} />
                    </Form>
                </CardBody>
                <CardFooter>
                    <div className="row m-0 justify-content-end">
                        <Button className="col-auto" color="primary" onClick={() => onCreateTorrent()}>Create</Button>
                    </div>
                </CardFooter>
            </Card>
        );
    }

    private _createTorrent(event?: React.KeyboardEvent<HTMLElement>) {
        if (event && event.key !== 'Enter') {
            return;
        }

        const { description } = this.state;
        if (this.state.torrentId && description) {
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
                    description,
                    filmId: this.props.film.id,
                    cut: 'Theatrical',
                    codec: 'XviD',
                    container: 'AVI',
                    resolution: 'Standard Def',
                    sourceMedia: 'DVD',
                    isScene: false,
                    isSource: false,
                    is3d: false,
                    nfo: 'something',
                    releaseGroup: 'something',
                    releaseName: 'something'
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
