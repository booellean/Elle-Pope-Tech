import Main from './components/MainComponent';
// import * as api from '../client/api';
import renderFetch from '../api/render';

import config from './../api/config';

const repo_URL = `https://api.github.com/user/repos?per_page=${config.perPage}`;
const user_URL = `https://api.github.com/users/${config.user}`;

const routes = [
  {
    path: '/open-source/:orgId',
    exact: false,
    component: Main,
    fetchInitialData: (path='') =>{ return renderFetch.renderOrgInfo(
      path.split('/').pop()
    )},
    name: 'org'
  },
  {
    path: '/repos/:repoId',
    exact: false,
    component: Main,
    fetchInitialData: (path='') =>{ return renderFetch.renderRepoInfo(
      path.split('/').pop()
    )},
    name: 'repo'
  },
  {
    path: '/repos',
    exact: false,
    component: Main,
    fetchInitialData: (path='', url=repo_URL, page=1) =>{ return renderFetch.renderUserRepos(
      path.split('/').pop(), url, page
    )},
    name: 'repos'
  },
  {
    path: '/open-source',
    exact: false,
    component: Main,
    fetchInitialData: (path='') =>{ return renderFetch.renderContribRepos(
      path.split('/').pop()
    )},
    name: 'open-source'
  },
  {
    path: '/',
    exact: true,
    component: Main,
    fetchInitialData: (path='', url=user_URL) =>{ return renderFetch.renderUserStats(
      path.split('/').pop(), url
    )},
    name: ''
  },
]

export default routes;