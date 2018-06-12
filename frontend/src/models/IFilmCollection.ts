
interface IFilmCollection {
    id: number;
    creatorId: number;
    creatorUsername: string;
    collectionComments: any;
    listId: number;
    url: string;
    listTitle: string;
    listDescription: string;
    collectionTags: string[];
    film: number[];
    filmTitle: string[];
    filmLink: string[];
}

export default IFilmCollection;