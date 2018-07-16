
import globals from '../../../utilities/globals';
import { get } from '../../../utilities/Requestor';
import IMediaTypes from '../../../models/IMediaTypes';
import { generateSage, generateAuthFetch } from '../../sagas/generators';

export type RequestMediaTypes = { type: 'REQUEST_MEDIA_TYPES' };
export type ReceivedMediaTypes = { type: 'RECEIVED_MEDIA_TYPES', types: IMediaTypes};
export type FailedTypes = { type: 'FAILED_MEDIA_TYPES' };

type MediaTypeAction = RequestMediaTypes | ReceivedMediaTypes | FailedTypes;
export default MediaTypeAction;
type Action = MediaTypeAction;

function received(types: IMediaTypes): Action {
    return { type: 'RECEIVED_MEDIA_TYPES', types };
}

function failure(): Action {
    return { type: 'FAILED_MEDIA_TYPES' };
}

export function getMediaTypes(): Action {
    return { type: 'REQUEST_MEDIA_TYPES' };
}

const errorPrefix = 'Fetching latest news failed';
const fetch = generateAuthFetch({ errorPrefix, request, received, failure });
export const mediaTypeSaga = generateSage<RequestMediaTypes>('REQUEST_MEDIA_TYPES', fetch);

function request(token: string): Promise<IMediaTypes> {
    return get({ token, url: `${globals.apiUrl}/valid-media-formats/` });
}