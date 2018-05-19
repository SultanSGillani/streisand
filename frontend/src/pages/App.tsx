import * as React from 'react';
import { connect } from 'react-redux';

import Store from '../store';
import Banner from '../components/Banner';
import SiteNav from '../components/SiteNav';
import { IDispatch } from '../actions/ActionTypes';
import { ScreenSize } from '../models/IDeviceInfo';
import { removeError } from '../actions/ErrorAction';
import { watchScreenSize } from '../utilities/device';
import { updateScreenSize } from '../actions/DeviceAction';

export type Props = {};

type ConnectedState = {
    errors: string[];
};

type ConnectedDispatch = {
    removeError: (index: number) => void;
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
                    {this._getErrorBanners()}
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

    private _getErrorBanners() {
        return this.props.errors.map((error: string, index: number) => {
            const onClose = () => { this.props.removeError(index); };
            return <Banner key={index} type="danger" onClose={onClose}>{error}</Banner>;
        });
    }
}

const mapStateToProps = (state: Store.All): ConnectedState => ({
    errors: state.errors
});

const mapDispatchToProps = (dispatch: IDispatch): ConnectedDispatch => ({
    removeError: (index: number) => dispatch(removeError(index)),
    updateScreenSize: (screenSize: ScreenSize) => dispatch(updateScreenSize(screenSize))
});

const App: React.ComponentClass<Props> =
    connect(mapStateToProps, mapDispatchToProps)(AppComponent);
export default App;