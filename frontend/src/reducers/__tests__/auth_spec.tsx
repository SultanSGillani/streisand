import auth, { initialState } from '../auth';

describe('reducers/auth', () => {
    it('returns failed state on "FAILED_AUTHENTICATION"', () => {
        expect(auth(initialState, { type: 'FAILED_AUTHENTICATION' })).toMatchSnapshot()
    })
})
