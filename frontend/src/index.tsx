import 'es6-promise/auto';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { browserHistory } from 'react-router';
import { AppContainer } from 'react-hot-loader';
import { syncHistoryWithStore } from 'react-router-redux';

import Root from './pages/Root.dev';
import configureStore from './store/configure.dev';

const store = configureStore(browserHistory);
const rootElement = document.getElementById('index');
const history = syncHistoryWithStore(browserHistory, store);

ReactDOM.render(
    <AppContainer>
        <Root store={store} history={history} />
    </AppContainer>,
    rootElement
);

declare var module: any;
declare var require: any;
if (module.hot) {
    module.hot.accept('./pages/Root.dev', () => {
        const NewRoot = require('./pages/Root.dev').default;
        ReactDOM.render(
            <AppContainer>
                <NewRoot store={store} history={history} />
            </AppContainer>,
            rootElement
        );
    });
}
