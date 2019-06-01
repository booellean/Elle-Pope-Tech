import * as CONFIG from './config';

const req_URL = `https://api.github.com/user/repos?access_token=${CONFIG.OAUTH}&per_page=${CONFIG.perPage}`

console.log(req_URL);