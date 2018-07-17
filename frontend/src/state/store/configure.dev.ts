import { History } from 'history';
import createSagaMiddleware from 'redux-saga';
import { routerMiddleware } from 'react-router-redux';
import { createStore, applyMiddleware, compose } from 'redux';

import Store from '.';
import sagas from '../sagas';
import reducers from '../reducers';
import DevTools from '../../components/DevTools';

declare var module: any;
declare var require: any;
const sagaMiddleware = createSagaMiddleware();
const configureStore = (history: History) => {
    const store = createStore(
        reducers,
        {} as Store.All,
        compose(
            applyMiddleware(sagaMiddleware, routerMiddleware(history)),
            DevTools.instrument()
        )
    );
    sagaMiddleware.run(sagas);

    if (module.hot) {
        // Enable Webpack hot module replacement for reducers
        module.hot.accept('../reducers', () => {
            const nextRootReducer = require('../reducers').default;
            store.replaceReducer(nextRootReducer);
        });
    }

    return store;
};

export default configureStore;
