import * as React from 'react';
import { connect } from 'react-redux';
import { Collapse, Button, Table, CardBody, Card, ButtonGroup, Nav, TabContent, TabPane, NavItem, NavLink, Row, Col, CardText, CardTitle } from 'reactstrap';

import Store from '../../store';
import IUser from '../../models/IUser';
import DataSize from '../generic/DataSize';
import globals from '../../utilities/globals';
import { getItem } from '../../utilities/mapping';
import { IDispatch } from '../../actions/ActionTypes';
import { ScreenSize } from '../../models/IDeviceInfo';
import { ITorrent, ITorrentFile } from '../../models/ITorrent';
import { deleteTorrent, IActionProps } from '../../actions/torrents/DeleteTorrentAction';
import IFilm from '../../models/IFilm';
import IRelease from '../../models/IRelease';
import TextView from '../bbcode/TextView';
import UserLink from '../links/UserLink';
import TimeElapsed from '../generic/TimeElapsed';

export type Props = {
    film: IFilm;
    torrent: ITorrent;
};

type State = {
    isOpen: boolean;
    activeTab: string;
};

type ConnectedState = {
    uploader?: IUser;
    release?: IRelease;
    screenSize: ScreenSize;
};

type ConnectedDispatch = {
    deleteItem: (props: IActionProps) => void;
};

type CombinedProps = Props & ConnectedDispatch & ConnectedState;
class TorrentRowComponent extends React.Component<CombinedProps, State> {
    constructor(props: CombinedProps) {
        super(props);

        this.state = {
            isOpen: false,
            activeTab: 'general'
        };
    }

    public render() {
        const { torrent, release } = this.props;
        if (!release) {
            return <div style={{ marginTop: '8px' }}>Torrent is not connected to a release.</div>;
        }

        let name = `${release.codec} / ${release.container} / ${release.sourceMedia} / ${release.resolution}`;
        if (release.is3d) {
            name += ' / 3D';
        }
        if (release.isScene) {
            name += ' / Scene';
        }
        const onDelete = () => {
            this.props.deleteItem({
                id: torrent.id,
                film: this.props.film.id
            });
        };

        const toggle = () => this.setState({ isOpen: !this.state.isOpen });
        const onDownload = () => location.href = `${globals.baseUrl}${torrent.downloadUrl}`;
        return (
            <>
                <tr>
                    <td className="align-middle"><Button color="link" onClick={toggle} title={name}>{name}</Button></td>
                    <td className="align-middle">{torrent.snatchCount}</td>
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
                    <td colSpan={4} className="p-0">
                        <Collapse isOpen={this.state.isOpen}>
                            <Card>
                                <CardBody className="pt-0">
                                    <Nav tabs>
                                        {this._getTab({ id: 'general', title: 'General' })}
                                        {this._getTab({ id: 'files', title: 'Files' })}
                                        {this._getTab({ id: 'nfo', title: 'NFO' })}
                                        {this._getTab({ id: 'media', title: 'Media' })}
                                    </Nav>
                                    <TabContent activeTab={this.state.activeTab}>
                                        <TabPane tabId="general" id="general">
                                            <GeneralContent release={release} uploader={this.props.uploader} torrent={torrent} />
                                        </TabPane>
                                        <TabPane tabId="files" id="files">
                                            <TorrentFiles torrent={torrent} />
                                        </TabPane>
                                        <TabPane tabId="nfo" id="nfo">
                                            <TorrentNfo release={release} />
                                        </TabPane>
                                        <TabPane tabId="media" id="media">
                                            <TorrentMedia release={release} />
                                        </TabPane>
                                    </TabContent>
                                </CardBody>
                            </Card>
                        </Collapse>
                    </td>
                </tr>
            </>
        );
    }

    private _getTab(props: { id: string; title: string; }) {
        const classes = this.state.activeTab === props.id ? 'active' : '';
        const onClick = () => { this.setState({ activeTab: props.id }); };
        return (
            <NavItem key={props.id}>
                <NavLink className={classes} onClick={onClick} href={`#${props.id}`}>
                    {props.title}
                </NavLink>
            </NavItem>
        );
    }
}

function TorrentNfo(props: { release: IRelease }) {
    const { release } = props;
    return (
        <Card body style={{ maxHeight: '250px', overflowY: 'scroll' }}>
            <CardTitle>Release Information (nfo)</CardTitle>
            <CardText>{release.nfo}</CardText>
        </Card>
    );
}

function GeneralContent(props: { release: IRelease, torrent: ITorrent, uploader?: IUser }) {
    const { release, torrent, uploader } = props;
    return (
        <Row className="mt-2">
            <Col sm="6">
                <Card body>
                    <CardTitle>Release Information</CardTitle>
                    <CardText>{release.releaseGroup} / {release.releaseName}</CardText>
                    <TextView content={release.description} />
                </Card>
            </Col>
            <Col sm="6">
                <Card body>
                    <CardTitle>User information</CardTitle>
                    <CardText>
                        Uploaded by <UserLink user={uploader} /> <TimeElapsed date={torrent.uploadedAt} />
                    </CardText>
                </Card>
            </Col>
        </Row>
    );
}

function TorrentFiles(props: { torrent: ITorrent }) {
    const { torrent } = props;
    const files = torrent.files.map((file: ITorrentFile) => {
        return (
            <tr key={file.path}>
                <td>{file.path}</td>
                <td><DataSize size={file.size} /></td>
            </tr>
        );
    });
    return (
        <Card body>
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
        </Card>
    );
}

interface IRowProps {
    label: string;
    value: string | number;
}

function InfoRow(props: IRowProps) {
    return (
        <tr>
            <td>{props.label}</td>
            <td>{props.value}</td>
        </tr>
    );
}

function TorrentMedia(props: { release: IRelease }) {
    const { release } = props;
    const info = release.mediainfo;
    return (
        <Row className="mt-2">
            <Col sm="6">
                <Card body>
                    <Table size="sm" className="table-borderless mb-0" striped>
                        <thead>
                            <tr>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {info && <InfoRow label="Runtime" value={info.runtime} />}
                            <InfoRow label="Codec" value={release.codec} />
                            <InfoRow label="Container" value={release.container} />
                            <InfoRow label="Cut" value={release.cut} />
                            {info && <InfoRow label="Bite rate" value={info.bitRate} />}
                            {info && <InfoRow label="Frame rate" value={info.frameRate} />}
                            <InfoRow label="Source" value={release.sourceMedia} />
                            {info && <InfoRow label="Aspect ratio" value={info.displayAspectRatio} />}
                            <InfoRow label="Resolution" value={release.resolution} />
                            {info && <InfoRow label="Width" value={info.resolutionWidth} />}
                            {info && <InfoRow label="Height" value={info.resolutionHeight} />}
                        </tbody>
                    </Table>
                </Card>
            </Col>
        </Row>
    );
}

const mapStateToProps = (state: Store.All, props: Props): ConnectedState => {
    return {
        screenSize: state.deviceInfo.screenSize,
        release: getItem({
            id: props.torrent.release,
            byId: state.sealed.release.byId
        }),
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