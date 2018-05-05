
interface ILoadingStatus {
    /* Whether the data is currently being queried */
    loading: boolean;
    /* Whether there has been at least one successful query of the data */
    loaded: boolean;
    /* Whether the most recent fetch of the data has failed failed */
    failed: boolean;
    /* Whether the an updated version of the data needs to be queried. It may mean the current data is inaccurate in some way. */
    outdated: boolean;
}

export const defaultStatus: ILoadingStatus = {
    loading: false,
    loaded: false,
    failed: false,
    outdated: false
};

export default ILoadingStatus;