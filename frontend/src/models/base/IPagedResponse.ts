
interface IPagedResponse<T> {
    count: number;
    results: T[];
}

export default IPagedResponse;