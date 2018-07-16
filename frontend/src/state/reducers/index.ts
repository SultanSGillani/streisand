import { routerReducer as routing } from 'react-router-redux';

import Store from '../store';
import { combineReducers } from './helpers';

import sealed from '../sealed/reducer';
import messages from '../message/reducer';
import location from '../location/reducer';
import deviceInfo from '../deviceInfo/reducer';
import mediaTypes from '../mediaTypes/reducer';

export default combineReducers<Store.All>({
    routing,
    location,
    messages,
    sealed,
    deviceInfo,
    mediaTypes
});
