declare const process: {
    env: {
        NODE_ENV: 'development' | 'production';
    }
};

const isProd = process.env.NODE_ENV === 'production';

const defaultPageSize = 25;
export default {
    apiUrl: isProd ? 'https://api.pinigseu.xyz/api/v1' : 'http://localhost:8000/api/v1',
    pageSize: {
        wikis: defaultPageSize,
        films: defaultPageSize,
        torrents: defaultPageSize,
        filmTorrents: defaultPageSize,
        threads: defaultPageSize,
        posts: 10
    }
};
