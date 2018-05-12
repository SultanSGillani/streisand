
interface IFilm {
    description: string;
    durationInMinutes: number;
    fanartUrl: string;
    id: number;
    imdbId: string;
    moderationNotes: string;
    posterUrl: string;
    tags: string[];
    title: string;
    tmdbId: number;
    lists: number[];
    trailerType: string;
    trailerUrl: string;
    year: number;
}

export interface IFilmUpdate {
    description: string;
    durationInMinutes: number;
    fanartUrl: string;
    imdbId: string;
    moderationNotes: string;
    posterUrl: string;
    tags?: string[];
    title: string;
    tmdbId: number;
    lists: number[];
    trailerType: string;
    trailerUrl: string;
    year: number;
}

export default IFilm;