
import Action from '../actions/wikis';
import IMediaTypes from '../models/IMediaTypes';
import { defaultMediaTypes } from './utilities/defaultMediaTypes';

function mediaTypes(state: IMediaTypes = defaultMediaTypes, action: Action): IMediaTypes {
    switch (action.type) {
        default:
            return state;
    }
}

export default mediaTypes;