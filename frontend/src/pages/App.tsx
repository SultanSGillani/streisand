import * as React from 'react';
import { connect } from 'react-redux';

import SiteNav from '../components/SiteNav';
import { IDispatch } from '../actions/ActionTypes';
import { ScreenSize } from '../models/IDeviceInfo';
import { watchScreenSize } from '../utilities/device';
import MessageBanner from '../components/MessageBanner';
import { updateScreenSize } from '../actions/DeviceAction';

export type Props = {};

type ConnectedState = {};
type ConnectedDispatch = {
    updateScreenSize: (screenSize: ScreenSize) => void;
};

type CombinedProps = Props & ConnectedState & ConnectedDispatch;
class AppComponent extends React.Component<CombinedProps> {
    private _screenSizeWatcher?: () => void;

    public render() {
        return (
            <div>
                <SiteNav />
                <div className="container mt-3">
                    <MessageBanner />
                    {this.props.children}
                </div>
            </div>
        );
    }

    public componentWillUnmount() {
        if (this._screenSizeWatcher) {
            window.removeEventListener('resize', this._screenSizeWatcher);
            this._screenSizeWatcher = undefined;
        }
    }

    public componentDidMount() {
        this._screenSizeWatcher = watchScreenSize((screenSize: ScreenSize) => {
            this.props.updateScreenSize(screenSize);
        });
        window.addEventListener('resize', this._screenSizeWatcher);
    }
}

const mapDispatchToProps = (dispatch: IDispatch): ConnectedDispatch => ({
    updateScreenSize: (screenSize: ScreenSize) => dispatch(updateScreenSize(screenSize))
});

const App: React.ComponentClass<Props> =
    connect(undefined, mapDispatchToProps)(AppComponent);
export default App;