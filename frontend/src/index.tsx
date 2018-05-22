import 'es6-promise/auto';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import Root from './pages/Root.dev';
import configureStore from './store/configure.dev';

const store = configureStore(browserHistory);
const rootElement = document.getElementById('index');
const history = syncHistoryWithStore(browserHistory, store);

ReactDOM.render(<Root store={store} history={history} />, rootElement);