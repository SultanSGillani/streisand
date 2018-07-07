import auth, { initialState } from '../auth';

describe('reducers/auth', () => {
    it ('returns empty state on "RECEIVED_LOGOUT"', () => {
        expect(auth(initialState, {type: 'RECEIVED_LOGOUT'})).toMatchSnapshot();
    });

    it('returns empty state on "FAILED_AUTHENTICATION"', () => {
        expect(auth(initialState, { type: 'FAILED_AUTHENTICATION' })).toMatchSnapshot();
    });

    it('returns state with isAuthenticating: true', () => {
        expect(auth(initialState, { type: 'REQUEST_AUTHENTICATION' })).toMatchSnapshot();
    });

    it('returns state with isAuthenticating: true and token: "12345"', () => {
        expect(auth(initialState, { type: 'RECEIVED_AUTHENTICATION', token: '12345' })).toMatchSnapshot()
    });

    it('returns state with isAuthenticating: true and token: "12345"', () => {
        expect(auth(initialState, { type: 'RECEIVED_REGISTRATION', token: '12345' })).toMatchSnapshot()
    });

    it('returns default state when given un-recognized action', () => {
        expect(auth(initialState, { type: 'UNRECOGNIZED' })).toMatchSnapshot()
    });
});
