
import IFilm from '../../../models/IFilm';
import { transformRelease } from './transforms';
import globals from '../../../utilities/globals';
import { get } from '../../../utilities/Requestor';
import { generateAuthFetch, generateSage } from '../../sagas/generators';
import IRelease, { IReleaseResponse } from '../../../models/IRelease';

interface IActionProps { id: number; }

export type RequestRelease = { type: 'REQUEST_RELEASE', props: IActionProps };
export type ReceivedRelease = { type: 'RECEIVED_RELEASE', release: IRelease, film: IFilm };
export type FailedRelease = { type: 'FAILED_RELEASE', props: IActionProps };

type ReleaseAction = RequestRelease | ReceivedRelease | FailedRelease;
export default ReleaseAction;
type Action = ReleaseAction;

export function received(response: IReleaseResponse): Action {
    const info = transformRelease(response);
    return {
        film: info.film,
        release: info.release,
        type: 'RECEIVED_RELEASE'
    };
}

function failure(props: IActionProps): Action {
    return { type: 'FAILED_RELEASE', props };
}

export function getRelease(id: number): Action {
    return { type: 'REQUEST_RELEASE', props: { id } };
}

const errorPrefix = (props: IActionProps) => `Fetching release (${props.id}) failed`;
const fetch = generateAuthFetch({ errorPrefix, request, received, failure });
export const releaseSaga = generateSage<RequestRelease>('REQUEST_RELEASE', fetch);

function request(token: string, props: IActionProps): Promise<IReleaseResponse> {
    return get({ token, url: `${globals.apiUrl}/releases/${props.id}/` });
}