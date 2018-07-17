import { all } from 'redux-saga/effects';

import { invitesSaga } from './actions/InvitesAction';
import { createInviteSaga } from './actions/CreateInviteAction';
import { deleteInviteSaga } from './actions/DeleteInviteAction';

export function* allInviteSaga() {
    yield all([
        invitesSaga(),
        createInviteSaga(),
        deleteInviteSaga()
    ]);
}