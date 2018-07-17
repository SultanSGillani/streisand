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
        collections: defaultPageSize,
        films: defaultPageSize,
        torrents: defaultPageSize,
        filmTorrents: defaultPageSize,
        threads: defaultPageSize,
        invites: defaultPageSize,
        releases: defaultPageSize,
        peers: defaultPageSize,
        simpleSearch: 5,
        comments: 10,
        posts: 10
    }
};
