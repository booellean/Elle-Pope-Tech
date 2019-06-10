import axios from 'axios';

export const fetchRepo = contestId => {
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

export const fetchProgrammer = () => {
  return axios.get('/api/programmer')
    .then( res => res.data);
};