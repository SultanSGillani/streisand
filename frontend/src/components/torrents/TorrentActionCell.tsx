import * as React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { Button, ButtonGroup } from 'reactstrap';

import IFilm from '../../models/IFilm';
import globals from '../../utilities/globals';
import { ITorrent } from '../../models/ITorrent';
import { IDispatch } from '../../actions/ActionTypes';
import { deleteTorrent, IActionProps } from '../../actions/torrents/DeleteTorrentAction';

export type Props = {
    film?: IFilm;
    torrent: ITorrent;
    page?: number;
};

type ConnectedState = {};
type ConnectedDispatch = {
    editRelease: (id: number) => void;
    deleteItem: (props: IActionProps) => void;
};

type CombinedProps = Props & ConnectedDispatch & ConnectedState;
class TorrentActionCellComponent extends React.Component<CombinedProps> {
    public render() {
        const { film, torrent, page } = this.props;

        const onEdit = () => this.props.editRelease(torrent.release || -404);
        const onDelete = () => {
            const filmId = film ? film.id : undefined;
            this.props.deleteItem({
                currentPage: page,
                id: torrent.id,
                film: filmId
            });
        };

        const downloadUrl = `${globals.baseUrl}${torrent.downloadUrl}`;
        return (
            <td>
                <div className="row justify-content-end no-gutters">
                    <ButtonGroup className="col-auto ml-auto" color="default" size="sm">
                        <a className="btn btn-secondary" href={downloadUrl} title="Download torrent file" role="button">
                            <i className="fas fa-arrow-down fa-lg" />
                        </a>
                        <Button onClick={onEdit} title="Edit release">
                            <i className="fas fa-pencil-alt fa-lg" />
                        </Button>
                        <Button color="danger" onClick={onDelete} title="Delete torrent">
                            <i className="fas fa-trash-alt fa-lg" />
                        </Button>
                    </ButtonGroup>
                </div>
            </td>
        );
    }
}
const mapDispatchToProps = (dispatch: IDispatch): ConnectedDispatch => ({
    editRelease: (id: number) => dispatch(push(`/release/${id}/edit`)),
    deleteItem: (props: IActionProps) => dispatch(deleteTorrent(props))
});

const TorrentActionCell: React.ComponentClass<Props> =
    connect(undefined, mapDispatchToProps)(TorrentActionCellComponent);
export default TorrentActionCell;