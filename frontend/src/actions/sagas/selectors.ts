import Store from '../../store';

export const getAuthToken = (state: Store.All) => state.sealed.auth.token;