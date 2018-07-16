import Store from '../../store';
import { AnyAction } from 'redux';
import { RouterAction } from 'react-router-redux';

// We have to define our own typing here for reduc and redux thunk integration
// Once this PR is resolved, we can look at using the package defined version again
// https://github.com/reduxjs/redux-thunk/pull/180/files
export type Action = { type: string; };
export type ThunkResult<T extends Action> = T | RouterAction | ThunkAction<T> | Promise<Action | ThunkAction<T>> | undefined;
export type ThunkAction<T extends Action> = (dispatch: IDispatch<T>, getState: () => Store.All) => ThunkResult<T>;
export interface IDispatch<T extends Action = AnyAction> {
    (action: T | RouterAction | ThunkAction<T>): T;
}