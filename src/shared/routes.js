import Main from './components/MainComponent';
// import * as api from '../client/api';
import renderFetch from '../api/render';

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
    fetchInitialData: (path='') =>{ return renderFetch.renderUserRepos(
      path.split('/').pop()
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
    fetchInitialData: (path='') =>{ return renderFetch.renderUserStats(
      path.split('/').pop()
    )},
    name: ''
  },
]

export default routes;