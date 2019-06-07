import React from 'react';
import ReactDOMServer from 'react-dom/server';
import fetch from 'node-fetch';

import App from '../shared/App';
// import { BrowserRouter } from 'react-router-dom';

import config from './config';

const req_URL = `https://api.github.com/user/repos?access_token=${config.OAUTH}&per_page=${config.perPage}`;

const apiRender = (reqId) =>
  fetch(req_URL, {

  })
  .then(res => {
    return res.json();
  })
  .then( res =>{
    return {
      initialMarkup: ReactDOMServer.renderToString(
        <BrowserRouter><App github={res} /></BrowserRouter>
      ),
      res
    };
  });

export default apiRender;
