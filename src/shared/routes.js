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
    )}
  },
  {
    path: '/repos/:repoId',
    exact: false,
    component: Main,
    fetchInitialData: (path='') =>{ return renderFetch.renderRepoInfo(
      path.split('/').pop()
    )}
  },
  {
    path: '/repos',
    exact: false,
    component: Main,
    fetchInitialData: (path='') =>{ return renderFetch.renderUserRepos(
      path.split('/').pop()
    )}
  },
  {
    path: '/open-source',
    exact: false,
    component: Main,
    fetchInitialData: (path='') =>{ return renderFetch.renderContribRepos(
      path.split('/').pop()
    )}
  },
  {
    path: '/',
    exact: true,
    component: Main,
    fetchInitialData: (path='') =>{ return renderFetch.renderUserStats(
      path.split('/').pop()
    )}
  },
]

export default routes;