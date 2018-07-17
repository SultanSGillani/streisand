export interface ICollectionUpdate {
    title: string;
    description: string;
}

interface ICollection extends ICollectionUpdate {
    id: number;
    creator: number; // user id
    comments: string;
    title: string; // Date
    description: string;
    filmId: number; // film id
    films: number;
    filmsCount: number;
}

export default ICollection;
