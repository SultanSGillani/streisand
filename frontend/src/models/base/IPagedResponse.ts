
interface IPagedResponse<T> {
    count: number;
    next: string;
    previous: string;
    results: T[];
}

export default IPagedResponse;