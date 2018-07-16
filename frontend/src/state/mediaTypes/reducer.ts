
import Action from './actions';
import IMediaTypes from '../../models/IMediaTypes';
import { defaultMediaTypes } from '../reducers/defaultMediaTypes';

function mediaTypes(state: IMediaTypes = defaultMediaTypes, action: Action): IMediaTypes {
    switch (action.type) {
        case 'RECEIVED_MEDIA_TYPES':
            return action.types;
        default:
            return state;
    }
}

export default mediaTypes;