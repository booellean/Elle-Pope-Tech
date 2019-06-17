import express from 'express';
import renderFetch from './render';
import config from './config';

const router = express.Router();

router.get('/user', (req, res) =>{
  renderFetch.renderUserStats(req)
  .then( ( data ) =>{
    res.send(data);
  })
  .catch(error => {
    console.error(error);
    res.status(404).send('Bad Request');
  });
})

router.get('/repos/:repoId', (req, res) => {
  renderFetch.renderRepoInfo(req.params.repoId)
  .then( ( data ) =>{
    res.send(data);
  })
  .catch(error => {
    console.error(error);
    res.status(404).send('Bad Request');
  });
});

router.get('/open-source/:orgId', (req, res) => {
  renderFetch.renderOrgInfo(req.params.orgId)
  .then( ( data ) =>{
    res.send(data);
  })
  .catch(error => {
    console.error(error);
    res.status(404).send('Bad Request');
  });
});

router.get('/repos', (req, res) => {
  renderFetch.renderUserRepos(req)
  .then( ( data ) =>{
    console.log(data);
    res.send(data);
  })
  .catch(error => {
    console.error(error);
    res.status(404).send('Bad Request');
  });
});


router.get('/open-source', (req, res) => {
  renderFetch.renderContribRepos(req)
  .then( ( data ) =>{
    res.send(data);
  })
  .catch(error => {
    console.error(error);
    res.status(404).send('Bad Request');
  });
});

router.get('/programmer', (req, res) => {
  // let contests = {};
  // mdb.collection('contests').find({})
  //   .project({
  //     categoryName: 1,
  //     contestName: 1
  //   })
  //   .each((err, contest) => {
  //     assert.equal(null, err);

  //     if (!contest) { // no more contests
  //       res.send({ contests });
  //       return;
  //     }

  //     contests[contest._id] = contest;
  //   });
  res.send('ProgrammerInfo');
});

export default router;