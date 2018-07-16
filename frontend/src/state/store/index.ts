import { RouterState } from 'react-router-redux';

import IMessage from '../../models/IMessage';
import { ISealedStore } from '../sealed/store';
import IMediaTypes from '../../models/IMediaTypes';
import ILocationInfo from '../../models/ILocationInfo';
import { IDeviceInfo } from '../../models/IDeviceInfo';

export interface IAllStore {
    sealed: ISealedStore;
    messages: IMessage[];
    routing: RouterState;
    location: ILocationInfo;
    deviceInfo: IDeviceInfo;
    mediaTypes: IMediaTypes;
}

namespace Store {
    export type All = IAllStore;
}

export default Store;
