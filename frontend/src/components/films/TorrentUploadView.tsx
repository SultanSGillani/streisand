import * as React from 'react';
import { Button } from 'reactstrap';
import { connect } from 'react-redux';

import Store from '../../store';
import IFilm from '../../models/IFilm';
import IMediaTypes from '../../models/IMediaTypes';
import { IDispatch } from '../../actions/ActionTypes';
import ReleaseForm, { IReleaseFormData } from '../releases/ReleaseForm';
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
};

type ConnectedState = {
    mediaTypes: IMediaTypes;
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

        this.state = { };
    }

    public render() {
        const film = this.props.film;
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
            <div className="input-group my-3">
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

        const onSubmit = (data: IReleaseFormData) => {
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
                    ...data
                }
            });
        };
        return (
            <ReleaseForm onSubmit={onSubmit} mediaTypes={this.props.mediaTypes} />
        );
    }
}

const mapStateToProps = (state: Store.All, props: Props): ConnectedState => {
    return {
        mediaTypes: state.mediaTypes
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
