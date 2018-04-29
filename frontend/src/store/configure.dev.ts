import thunk from 'redux-thunk';
import { History } from 'history';
import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'react-router-redux';

import Store from './index';
import reducers from '../reducers';
import DevTools from '../components/DevTools';

declare var module: any;
declare var require: any;
const configureStore = (history: History) => {
    const store = createStore(
        reducers,
        {} as Store.All,
        compose(
            applyMiddleware(thunk, routerMiddleware(history)),
            DevTools.instrument()
        )
    );

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
