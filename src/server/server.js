import express from 'express';
import preRender from '../api/render';
import config from '../api/config';
import apiRouter from '../api/index';

const app = express();

app.use('../api', apiRouter);
app.use(express.static('public'));

app.get(['/', '/repos', '/open-source'], (req, res) => {
  preRender.renderUserRepos(req)
  .then( ( data ) =>{
    res.send(`
      <!DOCTYPE html>
      <head>
        <title>Elle Pope Tech</title>
        <link rel='stylesheet' href='/css/main.css'>
        <script src='/bundle.js' defer></script>
      </head>
      <body>
        <div id='root'>${data.initialMarkup}</div>
        <script type="text/javascript">
          window.initialData = ${JSON.stringify(data.initialData)};
        </script>
      </body>
    </html>
    `);
  })
  .catch(error => {
    console.error(error);
    res.status(404).send('Bad Request');
  });
});

app.get(['/repos/:itemId', '/open-source/:itemId'], (req, res) => {
  preRender.renderOrgInfo(req.params.itemId)
  .then( ( data ) =>{
    res.send(`
      <!DOCTYPE html>
      <head>
        <title>Elle Pope Tech</title>
        <link rel='stylesheet' href='/css/main.css'>
        <script src='/bundle.js' defer></script>
      </head>
      <body>
        <div id='root'>${data.initialMarkup}</div>
        <script type="text/javascript">
          window.initialData = ${JSON.stringify(data.initialData)};
        </script>
      </body>
    </html>
    `);
  })
  .catch(error => {
    console.error(error);
    res.status(404).send('Bad Request');
  });
});

app.listen(config.port, config.host, () => {
  console.log(`Server is listening on ${config.host}:${config.port}`);
});