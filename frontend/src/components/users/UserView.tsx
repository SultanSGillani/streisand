import * as React from 'react';
import { connect } from 'react-redux';
import { ListGroup, ListGroupItem, Nav, NavItem, NavLink, TabContent, TabPane, Card, Button, Form, CardBody, CardFooter, Label } from 'reactstrap';

import Avatar from './Avatar';
import { getDateDiff } from '../../utilities/dates';
import { IDispatch } from '../../actions/ActionTypes';
import IUser, { IUserUpdate } from '../../models/IUser';
import { updateUser } from '../../actions/users/UpdateUserAction';
import { StringInput } from '../generic/inputs';
import TextView from '../bbcode/TextView';
import Editor, { IEditorHandle } from '../bbcode/Editor';

export type Props = {
    user: IUser;
};

type UserTabType = 'profile' | 'info' | 'edit';
type State = {
    activeTab: UserTabType;
    avatarUrl: string;
    email: string;
    profileDescription: string;
};

type ConnectedState = {};
type ConnectedDispatch = {
    updateUser: (id: number, update: IUserUpdate) => void;
};

interface IRowProps {
    label: string;
    value: string | number | boolean;
}

function InfoRow(props: IRowProps) {
    return (
        <ListGroupItem>
            <strong>{props.label}</strong>: <span className="text-muted">{`${props.value}`}</span>
        </ListGroupItem>
    );
}

type CombinedProps = ConnectedState & ConnectedDispatch & Props;
class UserViewComponent extends React.Component<CombinedProps, State> {
     private _editorHandle: IEditorHandle;

    constructor(props: CombinedProps) {
        super(props);

        this.state = {
            activeTab: 'profile',
            avatarUrl: '',
            email: '',
            profileDescription: ''
        };
    }

    public render() {
        const user = this.props.user;
        const details = user.details;
        if (!details) {
            return <div style={{ marginTop: '8px' }}>No information provided.</div>;
        }

        const onHandle = (handle: IEditorHandle) => { this._editorHandle = handle; };
        const lastSeeded = getDateDiff({ past: details.lastSeeded });
        const avatarUrl = this.state.avatarUrl || details.avatarUrl || '';
        const email = this.state.email || details.email || '';
        const description = details.profileDescription || '';
        const onUpdateUser = this._updateUser.bind(this);
        return (
            <div>
                <h1>{user.username}</h1>
                <Nav tabs className="mb-3">
                    {this._getTab('profile', 'Profile')}
                    {this._getTab('info', 'Info')}
                    {this._getTab('edit', 'Edit')}
                </Nav>
                <TabContent activeTab={this.state.activeTab}>
                    <TabPane tabId="profile" id="profile">
                        <Avatar user={user} />
                        <Card body className="mt-1">
                            <TextView content={description} />
                        </Card>
                    </TabPane>
                    <TabPane tabId="info" id="info">
                        <ListGroup>
                            <InfoRow label="Acount status" value={details.accountStatus} />
                            <InfoRow label="Class" value={details.userClass} />
                            <InfoRow label="Email" value={details.email} />
                            <InfoRow label="Donor" value={details.isDonor} />
                            <InfoRow label="Custome title" value={details.customTitle || ''} />
                            <InfoRow label="Average seeding size" value={details.averageSeedingSize} />
                            <InfoRow label="Invites" value={details.inviteCount} />
                            <InfoRow label="Bytes uploaded" value={details.bytesUploaded} />
                            <InfoRow label="Bytes downloaded" value={details.bytesDownloaded} />
                            <InfoRow label="Last seeded" value={lastSeeded} />
                            <InfoRow label="Announce Key" value={details.announceKey} />
                        </ListGroup>
                    </TabPane>
                    <TabPane tabId="edit" id="edit">
                        <Card>
                            <CardBody>
                                <Form onKeyPress={onUpdateUser} autoComplete="off">
                                    <StringInput id="avatarUrl" label="Avatar url" placeholder="avatar url"
                                        value={avatarUrl} setValue={(value: string) => this.setState({ avatarUrl: value })} />
                                    <StringInput type="email" id="email" label="Email" placeholder="email"
                                        value={email} setValue={(value: string) => this.setState({ email: value })} />
                                    <Label>Profile description</Label>
                                </Form>
                                <Editor content={description} receiveHandle={onHandle} size="small" />
                            </CardBody>
                            <CardFooter>
                                <div className="row m-0 justify-content-end">
                                    <Button className="col-auto" color="primary" onClick={() => onUpdateUser()}>Update</Button>
                                </div>
                            </CardFooter>
                        </Card>
                    </TabPane>
                </TabContent>
            </div>
        );
    }

    private _getTab(section: UserTabType, label: string) {
        const className = this.state.activeTab === section ? 'active' : '';
        const onClick = () => this.setState({ activeTab: section });
        return (
            <NavItem key={section}>
                <NavLink href={`#${section}`} className={className} onClick={onClick}>{label}</NavLink>
            </NavItem>
        );
    }

    private _updateUser(event?: React.KeyboardEvent<HTMLElement>) {
        if (event && event.key !== 'Enter') {
            return;
        }

        let { avatarUrl, email } = this.state;
        const content = this._editorHandle.getContent();
        const currentContent = this.props.user.details ? this.props.user.details.profileDescription : '';
        let update: IUserUpdate = { };
        if (avatarUrl) { update.avatarUrl = avatarUrl; }
        if (email) { update.email = email; }
        if (content !== currentContent) { update.profileDescription = content; }
        if (Object.keys(update).length > 0) {
            this.props.updateUser(this.props.user.id, update);
        }
        return false;
    }
}

const mapDispatchToProps = (dispatch: IDispatch): ConnectedDispatch => ({
    updateUser: (id: number, update: IUserUpdate) => dispatch(updateUser(id, update))
});

const UserView: React.ComponentClass<Props> =
    connect(undefined, mapDispatchToProps)(UserViewComponent);
export default UserView;
