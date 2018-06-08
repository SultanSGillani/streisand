import * as React from 'react';
import { Button } from 'reactstrap';
import { connect } from 'react-redux';

import Store from '../../store';
import IFilm from '../../models/IFilm';
import { IDispatch } from '../../actions/ActionTypes';
import ITorrentFileInfo from '../../models/ITorrentFileInfo';
import { uploadTorrent } from '../../actions/torrents/UploadTorrentAction';

export type Props = {
    film: IFilm;
};

type State = {
    file?: File;
};

type ConnectedState = {
    torrentFileInfo?: ITorrentFileInfo;
};

type ConnectedDispatch = {
    uploadTorrent: (file: File) => void;
};

type CombinedProps = Props & ConnectedDispatch & ConnectedState;
class TorrentUploadViewComponent extends React.Component<CombinedProps, State> {
    constructor(props: CombinedProps) {
        super(props);

        this.state = {};
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
            </div>
        );
    }
}

const mapStateToProps = (state: Store.All, props: Props): ConnectedState => {
    return {
        torrentFileInfo: state.sealed.torrentUpload.item
    };
};

const mapDispatchToProps = (dispatch: IDispatch): ConnectedDispatch => ({
    uploadTorrent: (file: File) => dispatch(uploadTorrent(file))
});

const TorrentUploadView: React.ComponentClass<Props> =
    connect(mapStateToProps, mapDispatchToProps)(TorrentUploadViewComponent);
export default TorrentUploadView;
