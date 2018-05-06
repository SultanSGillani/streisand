// declare const process: {
//     env: {
//         NODE_ENV: 'development' | 'production';
//     }
// };

// const isProd = process.env.NODE_ENV === 'production';

export default {
    pageSize: 25,
    // apiUrl: isProd ? 'https://www.ronzertnert.me/api/v1' : 'http://localhost:8000/api/v1'
    apiUrl: 'http://localhost:8000/api/v1'
};
