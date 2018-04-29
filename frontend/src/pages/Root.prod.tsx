import * as React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router';

import * as router from '../router';

interface IOwnProps extends React.Props<Root> {
    store: any; // TODO: type
    history: any; // TODO: type
 }

export default class Root extends React.Component<IOwnProps, null> {
    public render() {
        const { store, history } = this.props;
        return (
            <Provider store={store}>
                <div>
                    <Router history={history} routes={router.createRoutes(store)} />
                </div>
            </Provider>
        );
    }
}