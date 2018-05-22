import { History } from 'history';
import createSagaMiddleware from 'redux-saga';
import { createStore, applyMiddleware } from 'redux';
import { routerMiddleware } from 'react-router-redux';

import Store from './index';
import reducers from '../reducers';
import sagas from '../actions/sagas/all';

const configureStore = (history: History) => {
    const sagaMiddleware = createSagaMiddleware();
    const store = createStore(reducers, {} as Store.All, applyMiddleware(sagaMiddleware, routerMiddleware(history)));
    sagaMiddleware.run(sagas);
    return store;
};

export default configureStore;
