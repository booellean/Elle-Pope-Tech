import React from 'react';
import fetch from 'node-fetch';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';

import App from '../shared/App';
import config from './config';

const req_URL = `https://api.github.com/user/repos?access_token=${config.OAUTH}&per_page=${config.perPage}`;

const preRender = (req) =>
  fetch(req_URL, {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then( res => {
    return res.json();
  })
  .then( res =>{
    let markup = {
      initialMarkup: renderToString(<StaticRouter location={req.url}><App github={JSON.stringify(res)}/></StaticRouter>),
      initialData: res
    };
    console.log(markup.initialMarkup);
    return markup

  })
  .catch(error => {
    console.error(error);
    res.status(404).send('Bad Request');
  });;

export default preRender;