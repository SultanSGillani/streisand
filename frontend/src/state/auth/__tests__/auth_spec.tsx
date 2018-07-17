import auth, { initialState } from '../reducer';

describe('reducers/auth', () => {
    it ('returns empty state on "RECEIVED_LOGOUT"', () => {
        expect(auth(initialState, {type: 'RECEIVED_LOGOUT'})).toMatchSnapshot();
    });

    it('returns empty state on "FAILED_AUTHENTICATION"', () => {
        expect(auth(initialState, { type: 'FAILED_AUTHENTICATION' })).toMatchSnapshot();
    });

    it('returns state with isAuthenticating: true', () => {
        const props = { username: 'jumpcut', password: 'jumpcut' }
        expect(auth(initialState, { type: 'REQUEST_AUTHENTICATION', props })).toMatchSnapshot();
    });

    it('returns state with isAuthenticating: true and token: "12345"', () => {
        expect(auth(initialState, { type: 'RECEIVED_AUTHENTICATION', token: '12345' })).toMatchSnapshot()
    });

    it('returns state with isAuthenticating: true and token: "12345"', () => {
        expect(auth(initialState, { type: 'RECEIVED_REGISTRATION', token: '12345' })).toMatchSnapshot()
    });
});
