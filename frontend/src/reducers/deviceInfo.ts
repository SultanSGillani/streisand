import Action from '../actions/DeviceAction';
import IDeviceInfo from '../models/IDeviceInfo';
import { getScreenSize } from '../utilities/device';

const defaultValue: IDeviceInfo = {
    screenSize: getScreenSize()
};

function deviceInfo(state: IDeviceInfo = defaultValue, action: Action): IDeviceInfo {
    switch (action.type) {
        case 'SCREEN_SIZE_CHANGED':
            return {
                screenSize: action.screenSize
            };
        default:
            return state;
    }
}

export default deviceInfo;