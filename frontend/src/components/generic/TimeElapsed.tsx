import * as React from 'react';
import { connect } from 'react-redux';

import Store from '../../store';
import { ScreenSize } from '../../models/IDeviceInfo';
import { getDateDiff } from '../../utilities/dates';

type Props = {
    date: Date | string;
};

type ConnectedState = {
    screenSize: ScreenSize;
};

type CombinedProps = Props & ConnectedState;
class TimeElapsedComponent extends React.Component<CombinedProps> {
    public render() {
        if (!this.props.date) {
            return;
        }
        const levels = this.props.screenSize > ScreenSize.small ? 2 : 1;
        const diff = getDateDiff({ past: this.props.date, levels });
        return diff;
    }
}

const mapStateToProps = (state: Store.All): ConnectedState => ({
    screenSize: state.deviceInfo.screenSize
});

const TimeElapsed: React.ComponentClass<Props> =
    connect(mapStateToProps)(TimeElapsedComponent);
export default TimeElapsed;