
import Action from './actions';
import IDeviceInfo from '../../models/IDeviceInfo';
import { getScreenSize } from '../../utilities/device';

const defaultValue: IDeviceInfo = {
    screenSize: getScreenSize(),
    containerWidth: window.innerWidth
};

function deviceInfo(state: IDeviceInfo = defaultValue, action: Action): IDeviceInfo {
    switch (action.type) {
        case 'SCREEN_SIZE_CHANGED':
            return {
                screenSize: action.screenSize,
                containerWidth: action.containerWidth
            };
        default:
            return state;
    }
}

export default deviceInfo;