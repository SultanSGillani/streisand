
import IFilm from '../../models/IFilm';
import IRelease, { IReleaseResponse } from '../../models/IRelease';

export interface IReleaseInfo {
    release: IRelease;
    film: IFilm;
}
export function transformRelease(response: IReleaseResponse): IReleaseInfo {
    const { film, ...rest } = response;
    return {
        film,
        release: {
            ...rest,
            film: film.id
        }
    };

}

export interface IReleasesInfo {
    releases: IRelease[];
    films: IFilm[];
}
export function transformReleases(response: IReleaseResponse[]): IReleasesInfo {
    const films: IFilm[] = [];
    const releases: IRelease[] = [];
    for (const item of response) {
        const { film, ...rest } = item;
        films.push(film);
        releases.push({
            ...rest,
            film: film.id
        });
    }

    return { films, releases };
}