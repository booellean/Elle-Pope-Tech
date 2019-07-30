import express from 'express';
import renderFetch from './render';
import config from './config';

const repo_URL = `https://api.github.com/user/repos?per_page=${config.perPage}`;
const user_URL = `https://api.github.com/users/${config.user}`;

const router = express.Router();

router.get('/user', (req, res) =>{
  renderFetch.renderUserStats(req, user_URL)
  .then( ( data ) =>{
    res.send(data);
  })
  .catch(error => {
    console.error(error);
    res.status(404).send('Bad Request');
  });
})

router.get('/repos/:repoId', (req, res) => {
  renderFetch.renderRepoInfo(req.params.repoId, repo_URL)
  .then( ( data ) =>{
    res.send(data);
  })
  .catch(error => {
    console.error(error);
    res.status(404).send('Bad Request');
  });
});

router.get('/open-source/:orgId', (req, res) => {
  renderFetch.renderOrgInfo(req.params.orgId, config.openSource)
  .then( ( data ) =>{
    res.send(data);
  })
  .catch(error => {
    console.error(error);
    res.status(404).send('Bad Request');
  });
});

router.get('/repos', (req, res) => {
  renderFetch.renderAllRepos(req, repo_URL, 1)
  .then( ( data ) =>{
    res.send(data);
  })
  .catch(error => {
    console.error(error);
    res.status(404).send('Bad Request');
  });
});


router.get('/open-source', (req, res) => {
  renderFetch.renderContribRepos(req, config.openSource)
  .then( ( data ) =>{
    res.send(data);
  })
  .catch(error => {
    console.error(error);
    res.status(404).send('Bad Request');
  });
});

router.get('/details', (req, res, next) => {
  let url = req.params.url;
  let name = req.params.name;
  console.log(req.params);
  renderFetch.renderRepoUrlRequests(url, 1, name)
  .then( (data) =>{
    res.send(data);
  })
  .catch(error => {
    console.error(error);
    res.status(404).send('Bad Request');
  });
});

export default router;