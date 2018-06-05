declare const process: {
    env: {
        NODE_ENV: 'development' | 'production';
    }
};

const isProd = process.env.NODE_ENV === 'production';
const baseUrl = isProd ? 'https://api.pinigseu.xyz' : 'http://localhost:8000';

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
        posts: 10
    }
};
