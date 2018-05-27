import { routerReducer as routing } from 'react-router-redux';

import Store from '../store';
import { combineReducers } from './helpers';

import sealed from './sealed';
import errors from './errors';
import location from './location';
import deviceInfo from './deviceInfo';

export default combineReducers<Store.All>({
    routing,
    location,
    errors,
    sealed,
    deviceInfo
});
