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
        const { date } = this.props;
        if (!date) {
            return;
        }

        const levels = this.props.screenSize > ScreenSize.small ? 2 : 1;
        const diff = getDateDiff({ past: date, levels });
        const title = typeof date === 'string' ? date : date.toISOString();
        return <span title={title}>{diff}</span>;
    }
}

const mapStateToProps = (state: Store.All): ConnectedState => ({
    screenSize: state.deviceInfo.screenSize
});

const TimeElapsed: React.ComponentClass<Props> =
    connect(mapStateToProps)(TimeElapsedComponent);
export default TimeElapsed;