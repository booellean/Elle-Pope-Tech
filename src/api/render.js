import React from 'react';
import fetch from 'node-fetch';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';

import App from '../shared/App';
import config from './config';

// const req_URL = `https://api.github.com/user/repos?access_token=${config.OAUTH}&per_page=${config.perPage}`;
const repo_URL = `https://api.github.com/users/${config.user}/repos?per_page=${config.perPage}`;
const user_URL = `https://api.github.com/users/${config.user}/repos?per_page=${config.perPage}`;
const contrib_URL = `https://www.github.com/${config.user}?per_page=${config.perPage}`;

const fetchContribRepos = () =>{
  fetch(contrib_URL, {
    method: 'GET',
    mode: 'cors',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.OAUTH}`
    }
  })
  .then( res => {
    //convert HTML to text
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
    console.log(res);
    return res.map( item =>{
      return(
        fetch(`https://api.github.com/orgs/${item}`, {
          method: 'GET',
          mode: 'cors',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.OAUTH}`
          }
        })
        .then( res => {
          console.log(res);
          return res.json();
        })
        .then( res => {
          return res;
        })
        .catch(error =>{
          // console.error(error);
          return {};
        })
      );
    })
  })
  .then( res =>{
    let markup = {
      initialMarkup: renderToString(<StaticRouter location={req.url}><App github={JSON.stringify(res)}/></StaticRouter>),
      initialData: res
    };
    return markup
  })
  .catch(error => {
    // console.error(error);
    res.status(404).send('Bad Request');
  })
};

const preRender = {

  renderUserRepos : (req) =>
    fetch(repo_URL, {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
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
      // console.log(markup.initialMarkup);
      return markup;
    })
    .catch(error => {
      console.error(error);
      res.status(404).send('Bad Request');
    }),

    renderUserStats : (req) =>
      fetch(user_URL, {
        method: 'GET',
        mode: 'cors',
        credentials: 'include',
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
      }),

      renderContribRepos : (req) =>{
        // fetchContribRepos()
        // .then( res =>{
        //   let markup = {
        //     initialMarkup: renderToString(<StaticRouter location={req.url}><App github={JSON.stringify(res)}/></StaticRouter>),
        //     initialData: res
        //   };
        //   return markup

        // })
        // .catch(error => {
        //   console.error(error);
        //   res.status(404).send('Bad Request');
        // })
      },

      fetchContribRepos : (req) =>{
        fetch(contrib_URL, {
          method: 'GET',
          mode: 'cors',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.OAUTH}`
          }
        })
        .then( res => {
          //convert HTML to text
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
          return res.map( item =>{
            return(
              await fetch(`https://api.github.com/orgs/${item}`, {
                method: 'GET',
                mode: 'cors',
                credentials: 'include',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${config.OAUTH}`
                }
              }).json()
              // .then( res => {
              //   console.log(res);
              //   return res.json();
              // })
              // .then( res => {
              //   return res;
              // })
              .catch(error =>{
                // console.error(error);
                return {};
              })
            );
          });
        })
        .then( res =>{
          let markup = {
            initialMarkup: renderToString(<StaticRouter location={req.url}><App github={JSON.stringify(res)}/></StaticRouter>),
            initialData: res
          };
          return markup
        })
        .catch(error => {
          // console.error(error);
          res.status(404).send('Bad Request');
        })
      }
};

export default preRender;