import express from 'express';
import bodyParser from 'body-parser';
import render from './render';
import config from './config';

const server = express();
const router = express.Router();
server.use(bodyParser.json());

server.use(express.static('./../public'));
server.set('view engine', 'ejs');

router.get('/', (req, res) => {
  render(req.params.reqId)
    .then(({ initialMarkup, initialData }) => {
      res.render('index', {
        initialMarkup,
        initialData
      });
    })
    .catch(error => {
      console.error(error);
      res.status(404).send('Bad Request');
    });
});

router.get('/open-source/:orgId', (req, res) => {
  render(req.params.reqId)
    .then(({ initialMarkup, initialData }) => {
      res.render('index', {
        initialMarkup,
        initialData
      });
    })
    .catch(error => {
      console.error(error);
      res.status(404).send('Bad Request');
    });
});

router.get('/repos/:repoId', (req, res) => {
  render(req.params.reqId)
    .then(({ initialMarkup, initialData }) => {
      res.render('index', {
        initialMarkup,
        initialData
      });
    })
    .catch(error => {
      console.error(error);
      res.status(404).send('Bad Request');
    });
});

router.get('/stats', (req, res) => {
  render(req.params.reqId)
    .then(({ initialMarkup, initialData }) => {
      res.render('index', {
        initialMarkup,
        initialData
      });
    })
    .catch(error => {
      console.error(error);
      res.status(404).send('Bad Request');
    });
});

server.listen(config.port, config.host, () => {
  console.info('Express listening on port', config.port);
});