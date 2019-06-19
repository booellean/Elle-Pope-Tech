import express from 'express';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter, matchPath } from 'react-router-dom';
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
        <div id='root'>${renderToString(<StaticRouter location={req.url} context={{}}><App github={data}/></StaticRouter>)}</div>
        <script type="text/javascript">
          window.initialData = ${JSON.stringify(data)};
        </script>
      </body>
    </html>
    `
  return(markup);
}

app.get('*', (req, res, next) =>{

    // console.log(req.url);
    // console.log(routes);

  const matchRoute = routes.find(
    (route) => {
      const matchProfile = matchPath(req.url, route);
      // console.log(route);
      return (matchProfile && matchProfile.params) || {};
    }
  )

  const activeRoute = routes.filter( (route) => route.path === req.url)[0]

  console.log(matchRoute)
  console.log(activeRoute);

  activeRoute.fetchInitialData(req.path)
  .then( (data) =>{
    res.send(renderPage(req, data));
  })
  .catch(error => {
    console.error(error);
    res.status(404).send('Bad Request');
  });
})
//Routes
// app.get('/', (req, res) => {
//   renderFetch.renderUserStats(req)
//   .then( ( data ) =>{
//     res.send(renderPage(req, data));
//   })
//   .catch(error => {
//     console.error(error);
//     res.status(404).send('Bad Request');
//   });
// });

// app.get('/repos', (req, res) => {
//   renderFetch.renderUserRepos(req)
//   .then( ( data ) =>{
//     res.send(renderPage(req, data));
//   })
//   .catch(error => {
//     console.error(error);
//     res.status(404).send('Bad Request');
//   });
// });

// app.get('/open-source', (req, res) => {
//   renderFetch.renderContribRepos(req)
//   .then( ( data ) =>{
//     res.send(renderPage(req, data));
//   })
//   .catch(error => {
//     console.error(error);
//     res.status(404).send('Bad Request');
//   });
// });

// app.get('/open-source/:itemId', (req, res) => {
//   renderFetch.renderOrgInfo(req.params.itemId)
//   .then( ( data ) =>{
//     res.send(renderPage(req, data));
//   })
//   .catch(error => {
//     console.error(error);
//     res.status(404).send('Bad Request');
//   });
// });

// app.get('/repos/:itemId', (req, res) => {
//   renderFetch.renderRepoInfo(req.params.itemId)
//   .then( ( data ) =>{
//     res.send(renderPage(req, data));
//   })
//   .catch(error => {
//     console.error(error);
//     res.status(404).send('Bad Request');
//   });
// });

app.listen(config.port, config.host, () => {
  console.log(`Server is listening on ${config.host}:${config.port}`);
});
