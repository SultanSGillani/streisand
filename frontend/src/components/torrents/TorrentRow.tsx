import * as React from 'react';
import { connect } from 'react-redux';
import { Collapse, Button, Table, CardBody, Card, ButtonGroup } from 'reactstrap';

import Store from '../../store';
import IUser from '../../models/IUser';
import UserLink from '../links/UserLink';
import DataSize from '../generic/DataSize';
import globals from '../../utilities/globals';
import TimeElapsed from '../generic/TimeElapsed';
import { getItem } from '../../utilities/mapping';
import { IDispatch } from '../../actions/ActionTypes';
import { ScreenSize } from '../../models/IDeviceInfo';
import { ITorrent, ITorrentFile } from '../../models/ITorrent';
import { deleteTorrent, IActionProps } from '../../actions/torrents/DeleteTorrentAction';

export type Props = {
    torrent: ITorrent;
    page: number;
};

type State = {
    isOpen: boolean;
};

type ConnectedState = {
    screenSize: ScreenSize;
    uploader?: IUser;
};

type ConnectedDispatch = {
    deleteItem: (props: IActionProps) => void;
};

type CombinedProps = Props & ConnectedDispatch & ConnectedState;
class TorrentRowComponent extends React.Component<CombinedProps, State> {
    constructor(props: CombinedProps) {
        super(props);

        this.state = {
            isOpen: false
        };
    }

    public render() {
        const torrent = this.props.torrent;
        const onDelete = () => {
            this.props.deleteItem({
                id: torrent.id,
                currentPage: this.props.page
            });
        };
        const files = torrent.files.map((file: ITorrentFile) => {
            return (
                <tr key={file.path}>
                    <td>{file.path}</td>
                    <td><DataSize size={file.size} /></td>
                </tr>
            );
        });
        const toggle = () => this.setState({ isOpen: !this.state.isOpen });
        const toggleText = `${files.length} file${files.length === 1 ? '' : 's'} (${
            files.length === 1 ? torrent.files[0].path : torrent.directoryName
        })`;
        const onDownload = () => location.href = `${globals.baseUrl}${torrent.downloadUrl}`;
        return (
            <>
                <tr>
                    <td className="align-middle"><Button color="link" onClick={toggle}>{toggleText}</Button></td>
                    <td className="align-middle"><UserLink user={this.props.uploader} /></td>
                    <td className="align-middle"><TimeElapsed date={torrent.uploadedAt} /></td>
                    <td className="align-middle"><DataSize size={torrent.totalSizeInBytes} /></td>
                    <td>
                        <div className="row justify-content-end no-gutters">
                            <ButtonGroup className="col-auto ml-auto" color="default" size="sm">
                                <Button title="Download torrent file" onClick={onDownload}>
                                    <i className="fas fa-arrow-down fa-lg" />
                                </Button>
                                <Button color="danger" onClick={onDelete} title="Delete">
                                    <i className="fas fa-trash-alt fa-lg" />
                                </Button>
                            </ButtonGroup>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td colSpan={5} style={{ padding: 0 }}>
                        <Collapse isOpen={this.state.isOpen}>
                            <Card>
                                <CardBody>
                                    <Table size="sm" className="table-borderless mb-0" striped>
                                        <thead>
                                            <tr>
                                                <th>Path {torrent.directoryName && <span><small>(/{torrent.directoryName}/)</small></span>}</th>
                                                <th>Size</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {files}
                                        </tbody>
                                    </Table>
                                </CardBody>
                            </Card>
                        </Collapse>
                    </td>
                </tr>
            </>
        );
    }
}

const mapStateToProps = (state: Store.All, props: Props): ConnectedState => {
    return {
        screenSize: state.deviceInfo.screenSize,
        uploader: getItem({
            id: props.torrent.uploadedBy,
            byId: state.sealed.user.byId
        })
    };
};

const mapDispatchToProps = (dispatch: IDispatch): ConnectedDispatch => ({
    deleteItem: (props: IActionProps) => dispatch(deleteTorrent(props))
});

const TorrentRow: React.ComponentClass<Props> =
    connect(mapStateToProps, mapDispatchToProps)(TorrentRowComponent);
export default TorrentRow;