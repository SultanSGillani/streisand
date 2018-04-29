import * as React from 'react';
import * as redux from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { Modal, Button } from 'react-bootstrap';

import Store from '../../store';
import IFilm from '../../models/IFilm';
import ITorrent from '../../models/ITorrent';
import TorrentDetails from './TorrentDetails';

export type Props = {
    film: IFilm;
    torrent: ITorrent;
};

type ConnectedState = {};
type ConnectedDispatch = {
    goTo: (pathname: string) => void;
};

type CombinedProps = Props & ConnectedDispatch & ConnectedState;
class TorrentModalComponent extends React.Component<CombinedProps> {
    public render() {
        const film = this.props.film;
        const torrent = this.props.torrent;
        const onClose = () => {
            this.props.goTo(`/film/${film.id}`);
        };

        return (
            <Modal show={true} onHide={onClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{film.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <TorrentDetails film={film} torrent={torrent} />
                </Modal.Body>
                <Modal.Footer>
                    <Button bsStyle="primary" onClick={onClose}>Close</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

const mapDispatchToProps = (dispatch: redux.Dispatch<Store.All>): ConnectedDispatch => ({
    goTo: (pathname: string) => dispatch(push({ pathname: pathname }))
});

const TorrentModal: React.ComponentClass<Props> =
    connect(undefined, mapDispatchToProps)(TorrentModalComponent);
export default TorrentModal;
