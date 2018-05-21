import { takeEvery, ForkEffect, select, call, put } from 'redux-saga/effects';

import { getAuthToken } from './selectors';
import { handleError2 } from '../ErrorAction';
import Store from '../../store';

interface IBasicAction { type: string; }
export function generateSage<T extends IBasicAction>(type: T['type'], worker: (action: T) => IterableIterator<any>): () => IterableIterator<ForkEffect> {
    return function* () {
        yield takeEvery<T>(type, worker);
    };
}

interface IPropsAction<P> extends IBasicAction {
    props?: P;
}

interface IGenerateAuthFetchProps<P, R> {
    errorPrefix: string | ((props?: P) => string);
    filter?: (state: Store.All, props?: P) => P;
    request: (token: string, props?: P) => Promise<R>;
    received: (response: R, props?: P) => IBasicAction | IterableIterator<any>;
    failure: (props?: P) => IBasicAction;
}

const isAction = (a: any): a is IBasicAction => { return a && a.type; };

export function generateAuthFetch<A extends IPropsAction<P>, P, R>(props: IGenerateAuthFetchProps<P, R>): (action: A) => IterableIterator<any> {
    return function* (action: A) {
        let actionProps = action.props;
        try {
            let state: Store.All | undefined;
            if (props.filter) {
                state = (yield select()) as Store.All;
                actionProps = props.filter(state, actionProps);
            }
            const token = state ? getAuthToken(state) : yield select(getAuthToken);
            const data = yield call(props.request, token, actionProps);
            const result = props.received(data, actionProps);
            yield isAction(result) ? put(result) : result;
        } catch (error) {
            if (typeof props.errorPrefix === 'function') {
                yield handleError2(error, props.errorPrefix(actionProps));
            } else {
                yield handleError2(error, props.errorPrefix);
            }
            yield put(props.failure(actionProps));
        }
    };
}

interface IGenerateFetchProps<P, R> {
    errorPrefix: string;
    request: (props?: P) => Promise<R>;
    received: (response: R, props?: P) => IBasicAction | IterableIterator<any>;
    failure: (props?: P) => IBasicAction;
}

export function generateFetch<A extends IPropsAction<P>, P, R>(props: IGenerateFetchProps<P, R>): (action: A) => IterableIterator<any> {
    return function* (action: A) {
        let actionProps = action.props;
        try {
            const data = yield call(props.request, actionProps);
            const result = props.received(data, actionProps);
            yield isAction(result) ? put(result) : result;
        } catch (error) {
            yield handleError2(error, props.errorPrefix);
            yield put(props.failure(actionProps));
        }
    };
}