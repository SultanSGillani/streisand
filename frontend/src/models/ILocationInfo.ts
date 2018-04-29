
export interface ILocation {
    pathname: string;
    hash: string;
    query: { [key: string]: string };
    search: string;
}

interface ILocationInfo {
    referrer?: ILocation;
    previous?: ILocation;
    referred: boolean;
}

export default ILocationInfo;