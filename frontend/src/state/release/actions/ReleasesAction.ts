
import IFilm from '../../../models/IFilm';
import { transformReleases } from './transforms';
import globals from '../../../utilities/globals';
import { get } from '../../../utilities/Requestor';
import IPagedResponse from '../../../models/base/IPagedResponse';
import IRelease, { IReleaseResponse } from '../../../models/IRelease';
import { generateAuthFetch, generateSage } from '../../sagas/generators';

interface IActionProps { page: number; }
const PAGE_SIZE = globals.pageSize.releases;

export type RequestReleases = { type: 'REQUEST_RELEASES', props: IActionProps };
export type ReceivedReleases = {
    type: 'RECEIVED_RELEASES',
    films: IFilm[],
    props: { page: number, pageSize: number, count: number, items: IRelease[] }
};
export type FailedReleases = { type: 'FAILED_RELEASES', props: IActionProps };
export type InvalidateReleases = { type: 'INVALIDATE_RELEASES', props: IActionProps };

type ReleasesAction = RequestReleases | ReceivedReleases | FailedReleases | InvalidateReleases;
export default ReleasesAction;
type Action = ReleasesAction;

function received(response: IPagedResponse<IReleaseResponse>, props: IActionProps): Action {
    const info = transformReleases(response.results);
    return {
        type: 'RECEIVED_RELEASES',
        films: info.films,
        props: {
            page: props.page,
            pageSize: PAGE_SIZE,
            count: response.count,
            items: info.releases
        }
    };
}

function failure(props: IActionProps): Action {
    return { type: 'FAILED_RELEASES', props };
}

export function invalidate(props: IActionProps): Action {
    return { type: 'INVALIDATE_RELEASES', props };
}

export function getReleases(page: number = 1): Action {
    return { type: 'REQUEST_RELEASES', props: { page } };
}

const errorPrefix = (props: IActionProps) => `Fetching page ${props.page} of releases failed`;
const fetch = generateAuthFetch({ errorPrefix, request, received, failure });
export const releasesSaga = generateSage<RequestReleases>('REQUEST_RELEASES', fetch);

function request(token: string, props: IActionProps): Promise<IPagedResponse<IReleaseResponse>> {
    return get({ token, url: `${globals.apiUrl}/releases/?page=${props.page}&size=${PAGE_SIZE}` });
}