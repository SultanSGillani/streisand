
export default interface IError<T> {
    status: number;
    result: T;
}

export interface IUnkownError extends IError<any> {}