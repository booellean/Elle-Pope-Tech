import PersonalRepo from './components/PersonalRepoComponent';
import ContribRepo from './components/ContribRepoComponent';
import Home from './components/HomeComponent';
import * as api from '../client/api';
import renderFetch from '../api/render';

import config from './../api/config';

const repo_URL = `https://api.github.com/user/repos?per_page=${config.perPage}`;
const user_URL = `https://api.github.com/users/${config.user}`;

const routes = [
  {
    path: '/open-source/:orgId',
    exact: false,
    component: PersonalRepo,
    fetchInitialData: (path='', arr=config.openSource) =>{ return renderFetch.renderOrgInfo(
      path.split('/').pop(), arr
    )},
    name: 'org'
  },
  {
    path: '/repos/:repoId',
    exact: false,
    component: PersonalRepo,
    fetchInitialData: (path='', url=repo_URL) =>{ return renderFetch.renderRepoInfo(
      path.split('/').pop(), url
    )},
    name: 'repo'
  },
  {
    path: '/repos',
    exact: false,
    component: PersonalRepo,
    fetchInitialData: (path='', url=repo_URL, page=1) =>{ return renderFetch.renderAllRepos(
      path.split('/').pop(), url, page
    )},
    name: 'repos'
  },
  {
    path: '/open-source',
    exact: false,
    component: ContribRepo,
    fetchInitialData: (path='', arr=config.openSource) =>{ return renderFetch.renderContribRepos(
      path.split('/').pop(), arr
    )},
    name: 'open-source'
  },
  {
    path: '/',
    exact: true,
    component: Home,
    fetchInitialData: (path='', url=user_URL) =>{ return renderFetch.renderUserStats(
      path.split('/').pop(), url
    )},
    name: 'home'
  },
]

export default routes;