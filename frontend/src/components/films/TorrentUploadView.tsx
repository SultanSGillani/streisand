import * as React from 'react';
import { Button, Card, CardBody, Form, CardFooter } from 'reactstrap';
import { connect } from 'react-redux';

import Store from '../../store';
import IFilm from '../../models/IFilm';
import { IDispatch } from '../../actions/ActionTypes';
import ITorrentFileInfo from '../../models/ITorrentFileInfo';
import { uploadTorrent } from '../../actions/torrents/UploadTorrentAction';
import { ITorrentUpdate, IReleaseUpdate } from '../../models/ITorrent';
import { createTorrent } from '../../actions/torrents/CreateTorrentAction';
import { createRelease } from '../../actions/releases/CreateReleaseAction';
import { StringInput } from '../generic/inputs';

export type Props = {
    film: IFilm;
};

type State = {
    file?: File;
    description: string;
};

type ConnectedState = {
    torrentFileInfo?: ITorrentFileInfo;
};

type ConnectedDispatch = {
    uploadTorrent: (file: File) => void;
    createTorrent: (props: ITorrentUpdate) => void;
    createRelease: (props: IReleaseUpdate) => void;
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
        const torrentFile = this.state.file;
        const uploadTorrent = () => {
            if (this.state.file) {
                this.props.uploadTorrent(this.state.file);
            }
        };
        const label = torrentFile ? torrentFile.name : 'Choose file';
        const canUpload = !!torrentFile && !this.props.torrentFileInfo;
        return (
            <div>
                <h1>Torrent upload</h1>
                <h3>{film.title} [{film.year}]</h3>
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
                {this._getCreationCard()}
            </div>
        );
    }

    private _getCreationCard() {
        if (!this.props.torrentFileInfo) {
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
        if (this.props.torrentFileInfo && description) {
            // const { infoHash, downloadUrl } = this.props.torrentFileInfo;
            this.props.createRelease({
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
                releaseName: 'something',
                mediainfo: {
                    bitRate: 'something',
                    displayAspectRatio: 'something',
                    text: 'something'
                }
            });
        }
        return false;
    }
}

const mapStateToProps = (state: Store.All, props: Props): ConnectedState => {
    return {
        torrentFileInfo: state.sealed.torrentUpload.item
    };
};

const mapDispatchToProps = (dispatch: IDispatch): ConnectedDispatch => ({
    uploadTorrent: (file: File) => dispatch(uploadTorrent(file)),
    createRelease: (props: IReleaseUpdate) => dispatch(createRelease(props)),
    createTorrent: (props: ITorrentUpdate) => dispatch(createTorrent(props))
});

const TorrentUploadView: React.ComponentClass<Props> =
    connect(mapStateToProps, mapDispatchToProps)(TorrentUploadViewComponent);
export default TorrentUploadView;
