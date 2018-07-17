import { takeEvery, ForkEffect, select, call, put } from 'redux-saga/effects';

import Store from '../store';
import { getAuthToken } from './selectors';
import { handleError } from '../message/actions/MessageAction';

interface IBasicAction { type: string; }
export function generateSage<T extends IBasicAction>(type: T['type'], worker: (action: T) => IterableIterator<any>): () => IterableIterator<ForkEffect> {
    return function* () {
        yield takeEvery<T>(type, worker);
    };
}

interface IPropsAction<P> extends IBasicAction {
    props?: P;
}

interface IGenerateFetchProps<P, R> {
    errorPrefix: string;
    request: (props?: P) => Promise<R>;
    received: (response: R, props?: P) => IBasicAction | IterableIterator<any>;
    failure: (props?: P) => IBasicAction;
}

const isAction = (a: any): a is IBasicAction => { return a && a.type; };

export function generateFetch<A extends IPropsAction<P>, P, R>(props: IGenerateFetchProps<P, R>): (action: A) => IterableIterator<any> {
    return function* (action: A) {
        let actionProps = action.props;
        try {
            const data = yield call(props.request, actionProps);
            const result = props.received(data, actionProps);
            yield isAction(result) ? put(result) : result;
        } catch (error) {
            yield handleError(error, props.errorPrefix);
            yield put(props.failure(actionProps));
        }
    };
}

interface IGenerateAuthFetchProps<P, R> {
    errorPrefix: string | ((props?: P) => string);
    request: (token: string, props?: P) => Promise<R>;
    received: (response: R, props?: P) => IBasicAction | IterableIterator<any>;
    failure: (props?: P) => IBasicAction;
    transform?: (state: Store.All, props?: P) => P;
}

export function generateAuthFetch<A extends IPropsAction<P>, P, R>(props: IGenerateAuthFetchProps<P, R>): (action: A) => IterableIterator<any> {
    return function* (action: A) {
        let actionProps = action.props;
        try {
            let state: Store.All | undefined;
            if (props.transform) {
                state = (yield select()) as Store.All;
                actionProps = props.transform(state, actionProps);
            }
            const token = state ? getAuthToken(state) : yield select(getAuthToken);
            const data = yield call(props.request, token, actionProps);
            const result = props.received(data, actionProps);
            yield isAction(result) ? put(result) : result;
        } catch (error) {
            if (typeof props.errorPrefix === 'function') {
                yield handleError(error, props.errorPrefix(actionProps));
            } else {
                yield handleError(error, props.errorPrefix);
            }
            yield put(props.failure(actionProps));
        }
    };
}

interface IGenerateFilteredFetchProps<P, R> extends IGenerateAuthFetchProps<P, R> {
    filter: (state: Store.All, props?: P) => P | undefined;
    requesting: (props?: P) => IBasicAction;
}

export function generateFilteredFetch<A extends IPropsAction<P>, P, R>(props: IGenerateFilteredFetchProps<P, R>): (action: A) => IterableIterator<any> {
    return function* (action: A) {
        let actionProps = action.props;
        try {
            const state: Store.All = yield select();
            actionProps = props.filter(state, actionProps);
            if (!actionProps) {
                return;
            }
            yield put(props.requesting(actionProps));
            const token = state ? getAuthToken(state) : yield select(getAuthToken);
            const data = yield call(props.request, token, actionProps);
            const result = props.received(data, actionProps);
            yield isAction(result) ? put(result) : result;
        } catch (error) {
            if (typeof props.errorPrefix === 'function') {
                yield handleError(error, props.errorPrefix(actionProps));
            } else {
                yield handleError(error, props.errorPrefix);
            }
            yield put(props.failure(actionProps));
        }
    };
}
