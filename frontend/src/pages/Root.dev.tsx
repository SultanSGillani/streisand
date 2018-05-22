import * as React from 'react';
import { Router } from 'react-router';
import { hot } from 'react-hot-loader';
import { Provider } from 'react-redux';

import DevTools from '../components/DevTools';
import * as router from '../router';

interface IOwnProps extends React.Props<Root> {
    store: any; // TODO: type
    history: any; // TODO: type
}

class Root extends React.Component<IOwnProps> {
    public render() {
        const { store, history } = this.props;
        return (
            <Provider store={store}>
                <div>
                    <Router history={history} routes={router.createRoutes(store)} />
                    <DevTools />
                </div>
            </Provider>
        );
    }
}

export default hot(module)(Root);