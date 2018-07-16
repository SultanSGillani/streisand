declare const process: {
    env: {
        NODE_ENV: 'development' | 'production';
        APIURL: string;
    }
};

const baseUrl = localStorage['app.api.url'] || process.env.APIURL;

const defaultPageSize = 25;
export default {
    baseUrl: baseUrl,
    apiUrl: `${baseUrl}/api/v1`,
    pageSize: {
        wikis: defaultPageSize,
        films: defaultPageSize,
        torrents: defaultPageSize,
        filmTorrents: defaultPageSize,
        threads: defaultPageSize,
        invites: defaultPageSize,
        releases: defaultPageSize,
        peers: defaultPageSize,
        comments: 2,
        simpleSearch: 5,
        posts: 10
    }
};
