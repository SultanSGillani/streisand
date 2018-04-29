import thunk from 'redux-thunk';
import { History } from 'history';
import { createStore, applyMiddleware } from 'redux';
import { routerMiddleware } from 'react-router-redux';

import Store from './index';
import reducers from '../reducers';

const configureStore = (history: History) => {
    return createStore(reducers, {} as Store.All, applyMiddleware(thunk, routerMiddleware(history)));
};

export default configureStore;
