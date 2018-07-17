
import InvitesAction from './InvitesAction';
import CreateInviteAction from './CreateInviteAction';
import DeleteInviteAction from './DeleteInviteAction';

type Action = InvitesAction | CreateInviteAction | DeleteInviteAction;
export default Action;