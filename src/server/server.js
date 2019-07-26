import express from 'express';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter, matchPath } from 'react-router-dom';
import { matchRoutes } from 'react-router-config';
import routes from '../shared/routes';
// import renderFetch from '../api/render';
import config from '../api/config';
import apiRouter from '../api/index';

import App from '../shared/App';

const app = express();

app.use('/api', apiRouter);
app.use(express.static('public'));

//Initial Markup Rendered
const renderPage = (req, data) =>{
  let context = { data };
  let markup =`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Elle Pope Tech</title>
        <link rel='stylesheet' href='/css/main.css'>
        <script src='/bundle.js' defer></script>
      </head>
      <body>
        <div id='root'>${renderToString(<StaticRouter location={req.url} context={{}}><App github={data} location={req.url}/></StaticRouter>)}</div>
        <script type="text/javascript">
          window.initialData = ${data};
        </script>
      </body>
    </html>
    `
  return(markup);
}

app.get('*', (req, res, next) =>{

  const matchingRoutes = matchRoutes(routes, req.url);
  let promises = [];

  matchingRoutes.forEach(obj => {
    let id = req.path.split('/').pop();
    if (obj.route.fetchInitialData) {
      promises.push(obj.route.fetchInitialData(id));
    }
  });

  Promise.all(promises)
  .then( (data) =>{
    res.send(renderPage(req, data));
  })
  .catch(error => {
    console.error(error);
    res.status(404).send('Bad Request');
  });
})

app.listen(config.port, config.host, () => {
  console.log(`Server is listening on ${config.host}:${config.port}`);
});
