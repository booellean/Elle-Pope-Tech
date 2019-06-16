import React from 'react';
import fetch from 'node-fetch';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';

import App from '../shared/App';
import config from './config';

const repo_URL = `https://api.github.com/users/${config.user}/repos?per_page=${config.perPage}`;
const user_URL = `https://api.github.com/users/${config.user}`;
const contrib_URL = `https://www.github.com/${config.user}?per_page=${config.perPage}`;

const preRender = {
  renderUserRepos : (req) =>{
    return (
      fetch(repo_URL, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.OAUTH}`
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
        return markup

      })
      .catch(error => {
        console.error(error);
        res.status(404).send('Bad Request');
      })
    );
  },

  renderUserStats : (req) =>{
    return (
      fetch(user_URL, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.OAUTH}`
        }
      })
      .then( res => {
        return res.json();
      })
      .then( res =>{
        return [res];
      })
      .then( res =>{
        let markup = {
          initialMarkup: renderToString(<StaticRouter location={req.url}><App github={JSON.stringify(res)}/></StaticRouter>),
          initialData: res
        };
        return markup

      })
      .catch(error => {
        console.error(error);
        res.status(404).send('Bad Request');
      })
    );
  },

  renderContribRepos : (req) =>{
    return (
      fetch(contrib_URL, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.OAUTH}`
        }
      })
      .then( res => {
        return res.text();
      })
      .then( res => {
        //split text into an array split by space
        return res.split(' ');
      })
      .then( res => {
        //filter out all object that don't start with '@'
        //This will leave you with a messy list of organizations you've contributed to
        return res.filter( item => item.indexOf('@') === 0 )
      })
      .then( res => {
        //Clean up all the gobbly gook
        //organization name will exist between '@' and first '\'
        return res.map( item => {
          let startPos = item.indexOf('@') + 1;
          let endPos = item.indexOf(`\n`);
          return item.substring(startPos, endPos)
        })
      })
      .then( res =>{
        return Promise.all( res.map ( item =>{
          return(
            fetch(`https://api.github.com/orgs/${item}`, {
              method: 'GET',
              mode: 'cors',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.OAUTH}`
              }
            })
            .then( res =>{
              return res.json();
            })
            .catch( error =>{
              console.error( error );
              return {error: 'Organizations not Found!'}
            })
          );
        }))
      })
      .then( res =>{
        let markup = {
          initialMarkup: renderToString(<StaticRouter location={req.url}><App github={JSON.stringify(res)}/></StaticRouter>),
          initialData: res
        };
        return markup

      })
      .catch(error => {
        console.error(error);
        res.status(404).send('Bad Request');
      })
    );
  },

  renderRepoInfo : (reqId) =>{
    return (
      fetch(`https://api.github.com/repos/booellean/${reqId}`, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.OAUTH}`
        }
      })
      .then( res => {
        return res.json();
      })
      .then( res =>{
        return [res];
      })
      .then( res =>{
        let markup = {
          initialMarkup: renderToString(<StaticRouter location={reqId.url}><App github={JSON.stringify(res)}/></StaticRouter>),
          initialData: res
        };
        return markup

      })
      .catch(error => {
        console.error(error);
        res.status(404).send('Bad Request');
      })
    );
  },

  renderOrgInfo : (reqId) =>{
    return (
      fetch(`https://api.github.com/orgs/${reqId}/repos`, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.OAUTH}`
        }
      })
      .then( res => {
        return res.json();
      })
      .then( res =>{
        return Promise.all( res.map( item =>{
          const original = item
          return(
            fetch(`${item.contributors_url}`, {
              method: 'GET',
              mode: 'cors',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.OAUTH}`
              }
              })
              .then( res =>{
                return res.json()
              })
              .then( res =>{
                original['contributorsUrl'] = res;
                return original;
              })
              .catch( error =>{
                console.error( error );
                return {error: 'Organizations not Found!'}
              })
          );
        }));
      })
      // .then( res =>{
      //   return res.forEach( item =>{
      //     item.contributorsUrl.filter( obj =>{
      //       return obj.login === config.user;
      //     })
      //   })
      // })
      .then( res =>{
        let markup = {
          initialMarkup: renderToString(<StaticRouter location={reqId.url}><App github={JSON.stringify(res)}/></StaticRouter>),
          initialData: res
        };
        return markup
      })
      .catch(error => {
        console.error(error);
        res.status(404).send('Bad Request');
      })
    );
  },
}

export default preRender;