import React from 'react';
import fetch from 'node-fetch';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';

import App from '../shared/App';
import config from './config';

const req_URL = `https://api.github.com/user/repos?access_token=${config.OAUTH}&per_page=${config.perPage}`;

const preRender = (req) =>
  fetch(req_URL, {

  })
  .then(res => {
    return res.json();
  })
  .then( res =>{
    return {
      initialMarkup: renderToString(<StaticRouter location={req.url}><App github={res}/></StaticRouter>),
      res
    };
  })
  .catch(error => {
    console.error(error);
    res.status(404).send('Bad Request');
  });;

export default preRender;