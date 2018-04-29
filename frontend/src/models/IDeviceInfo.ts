
// These breakpoints mirror what Bootstrap uses
export const enum ScreenSize {
    extraSmall, // [0] 0 - 575px
    small,      // [1] 576px - 767px
    medium,     // [2] 768px - 991px
    large,      // [3] 992px - 1199px
    extraLarge  // [4] 1200px and above
}

export interface IDeviceInfo {
    screenSize: ScreenSize;
}

export default IDeviceInfo;