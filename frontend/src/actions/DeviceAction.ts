import { ScreenSize } from '../models/IDeviceInfo';

type DeviceAction = { type: 'SCREEN_SIZE_CHANGED', screenSize: ScreenSize, containerWidth: number };
export default DeviceAction;
type Action = DeviceAction;

export function updateScreenSize(screenSize: ScreenSize, containerWidth: number): Action {
    return { type: 'SCREEN_SIZE_CHANGED', screenSize, containerWidth };
}