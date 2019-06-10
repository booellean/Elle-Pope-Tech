import express from 'express';
import apiRender from './render';
import config from './config';

const router = express.Router();

router.get('/repos/:repoId', (req, res) => {
  res.send('ReposId');
  // mdb.collection('contests')
  //   .findOne({ _id: ObjectID(req.params.contestId) })
  //   .then(contest => res.send(contest))
  //   .catch(error => {
  //     console.error(error);
  //     res.status(404).send('Bad Request');
  //   });
});

router.get('/open-source/:orgId', (req, res) => {
  res.send('OrgsId');
  // mdb.collection('contests')
  //   .findOne({ _id: ObjectID(req.params.contestId) })
  //   .then(contest => res.send(contest))
  //   .catch(error => {
  //     console.error(error);
  //     res.status(404).send('Bad Request');
  //   });
});

router.get('/repos', (req, res) => {
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
  res.send('AllRepos');
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

export default apiRouter;