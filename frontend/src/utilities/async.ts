
export const debounce = (callback: Function, time: number = 500, interval: any = undefined) => (...args) => {
    clearTimeout(interval);
    interval = setTimeout(() => { callback(...args); }, time);
};
