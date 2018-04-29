import { ScreenSize } from '../models/IDeviceInfo';

type DeviceAction = { type: 'SCREEN_SIZE_CHANGED', screenSize: ScreenSize };
export default DeviceAction;
type Action = DeviceAction;

export function updateScreenSize(screenSize: ScreenSize): Action {
    return { type: 'SCREEN_SIZE_CHANGED', screenSize };
}