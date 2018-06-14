import * as React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';

import IFilm from '../../models/IFilm';
import ITorrent from '../../models/ITorrent';
import TorrentDetails from './TorrentDetails';
import { IDispatch } from '../../actions/ActionTypes';

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
            <Modal isOpen={true} toggle={onClose}>
                <ModalHeader toggle={onClose}>{film.title}</ModalHeader>
                <ModalBody>
                    <TorrentDetails film={film} torrent={torrent} />
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={onClose}>Close</Button>
                </ModalFooter>
            </Modal>
        );
    }
}

const mapDispatchToProps = (dispatch: IDispatch): ConnectedDispatch => ({
    goTo: (pathname: string) => dispatch(push({ pathname: pathname }))
});

const TorrentModal: React.ComponentClass<Props> =
    connect(undefined, mapDispatchToProps)(TorrentModalComponent);
export default TorrentModal;
