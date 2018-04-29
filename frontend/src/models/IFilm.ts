
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
    tmdbId: string;
    trailerType: string;
    trailerUrl: string;
    year: number;
}

export default IFilm;