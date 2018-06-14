
// Editable fields
export interface IFilmUpdate {
    description: string;
    durationInMinutes: number;
    fanartUrl: string;
    imdbId: string;
    moderationNotes: string;
    posterUrl: string;
    genreTags: string[];
    title: string;
    tmdbId: number;
    lists: number[];
    trailerType: string;
    trailerUrl: string;
    year: number;
}

interface IFilm extends IFilmUpdate {
    id: number;
}

export default IFilm;
