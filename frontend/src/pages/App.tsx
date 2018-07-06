import * as React from 'react';
import { connect } from 'react-redux';

import SiteNav from '../components/SiteNav';
import { IDispatch } from '../actions/ActionTypes';
import { ScreenSize } from '../models/IDeviceInfo';
import { getScreenSize } from '../utilities/device';
import MessageBanner from '../components/MessageBanner';
import { updateScreenSize } from '../actions/DeviceAction';

export type Props = {};

type ConnectedState = {};
type ConnectedDispatch = {
    updateScreenSize: (screenSize: ScreenSize, containerWidth: number) => void;
};

type CombinedProps = Props & ConnectedState & ConnectedDispatch;
class AppComponent extends React.Component<CombinedProps> {
    private _screenSizeWatcher?: () => void;
    private _container: React.RefObject<HTMLDivElement>;

    constructor(props: CombinedProps) {
        super(props);

        this._container = React.createRef();
    }

    public render() {
        return (
            <div>
                <SiteNav />
                <div className="container">
                    <div ref={this._container}>
                        <MessageBanner />
                        {this.props.children}
                    </div>
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
        let currentSize = getScreenSize();
        let currentWidth: number = window.innerWidth;
        if (this._container && this._container.current) {
            currentWidth = this._container.current.clientWidth;
            this.props.updateScreenSize(currentSize, currentWidth);
        }
        this._screenSizeWatcher = () => {
            const size = getScreenSize();
            const width = (this._container && this._container.current)
                ? this._container.current.clientWidth
                : currentWidth;
            if (width !== currentWidth || size !== currentSize) {
                currentSize = size;
                currentWidth = width;
                this.props.updateScreenSize(size, width);
            }
        };
        window.addEventListener('resize', this._screenSizeWatcher);
    }
}

const mapDispatchToProps = (dispatch: IDispatch): ConnectedDispatch => ({
    updateScreenSize: (screenSize: ScreenSize, containerWidth: number) => dispatch(updateScreenSize(screenSize, containerWidth))
});

const App: React.ComponentClass<Props> =
    connect(undefined, mapDispatchToProps)(AppComponent);
export default App;