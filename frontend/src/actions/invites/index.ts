import { all } from 'redux-saga/effects';

import InvitesAction, { invitesSaga } from './InvitesAction';
import CreateInviteAction, { createInviteSaga } from './CreateInviteAction';
import DeleteInviteAction, { deleteInviteSaga } from './DeleteInviteAction';

type Action = InvitesAction | CreateInviteAction | DeleteInviteAction;
export default Action;

export function* allInviteSaga() {
    yield all([
        invitesSaga(),
        createInviteSaga(),
        deleteInviteSaga()
    ]);
}