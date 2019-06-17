import axios from 'axios';

export const fetchRepo = repoId => {
  return axios.get(`/api/repos/${repoId}`)
    .then( res => res.data);
};

export const fetchOrg = orgId => {
  return axios.get(`/api/open-source/${orgId}`)
    .then( res => res.data);
};

export const fetchRepos= () => {
  return axios.get(`/api/repos`)
    .then( res => res.data);
};

export const fetchUserStats= () => {
  return axios.get('/api/user')
    .then( res => res.data);
};