import { routerReducer as routing } from 'react-router-redux';

import Store from '../store';
import { combineReducers } from './helpers';

import sealed from './sealed';
import messages from './messages';
import location from './location';
import deviceInfo from './deviceInfo';

export default combineReducers<Store.All>({
    routing,
    location,
    messages,
    sealed,
    deviceInfo
});
