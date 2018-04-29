import Store from '../store';
import { RouterAction } from 'react-router-redux';

export type ReduxAction = { type: string; };
export type ThunkAction<T extends ReduxAction> = (dispatch: IDispatch<T>, getState: () => Store.All) => T | RouterAction | ThunkAction<T> | Promise<ReduxAction | ThunkAction<T>>;
export interface IDispatch<T extends ReduxAction> {
    (action: T | RouterAction | ThunkAction<T>): T;
}
