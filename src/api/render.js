import React from 'react';
import fetch from 'isomorphic-fetch';
import config from './config';

let tmpArray = [];

// const repo_URL = `https://api.github.com/users/${config.user}/repos?per_page=${config.perPage}`;
const repo_URL = `https://api.github.com/user/repos?per_page=${config.perPage}`;
const user_URL = `https://api.github.com/users/${config.user}`;
// const contrib_URL = `https://github.com/${config.user}`;

// Need to stringify data before it is sent to the server, some sort of bug in the package returns it as an array
const preRender = (data) =>{
  return JSON.stringify(data);
}

const renderFetch = {
  renderAllRepos : (req, url, page) =>{
    // let thisUrl = url;
    // let thisPage = page;
    // let thisReq = req;
    return (
      fetch(`${url}&page=${page}`, {
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
        if(res.length === config.perPage){
          tmpArray.push(...res);
          return renderFetch.renderAllRepos(req, url, page+1);
        }else{
          tmpArray.push(...res);
          let personalRepos = tmpArray.filter( item => {
            return item.owner.login === config.user && item.fork === false && item.private !== true;
          });
          let contribRepos = tmpArray.filter( item =>{
            return item.owner.login !== config.user || item.fork === true;
          });
          let finalObj = { 'repos' : personalRepos, 'open-source': contribRepos};
          return preRender(finalObj);
        }
      })
      .catch(error => {
        console.error(error);
        res.status(404).send('Bad Request');
      })
    );
  },

  renderUserStats : (req, url) =>{
    return (
      fetch(url, {
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
        return preRender({ 'home' : [res] });
      })
      .catch(error => {
        console.error(error);
        res.status(404).send('Bad Request');
      })
    );
  },

  //Too many limitations with the below code, especially with preflight requests. Will need to Go with another method
  // renderContribRepos : (req) =>{
  //   return (
  //     fetch(contrib_URL, {
  //       method: 'GET',
  //       mode: 'cors',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': `Bearer ${config.OAUTH}`,
  //         'Access-Control-Allow-Credentials' : 'true',
  //         'Access-Control-Allow-Origin': '*',
  //         'Access-Control-Allow-Methods': '*',
  //         'Access-Control-Allow-Headers': '*'
  //       },
  //       body: null
  //     })
  //     .then( res => {
  //       return res.text();
  //     })
  //     .then( res => {
  //       //split text into an array split by space
  //       return res.split(' ');
  //     })
  //     .then( res => {
  //       //filter out all object that don't start with '@'
  //       //This will leave you with a messy list of organizations you've contributed to
  //       return res.filter( item => item.indexOf('@') === 0 )
  //     })
  //     .then( res => {
  //       //Clean up all the gobbly gook
  //       //organization name will exist between '@' and first '\'
  //       return res.map( item => {
  //         let startPos = item.indexOf('@') + 1;
  //         let endPos = item.indexOf(`\n`);
  //         return item.substring(startPos, endPos)
  //       })
  //     })
  //     .then( res =>{
  //       return Promise.all( res.map ( item =>{
  //         return(
  //           fetch(`https://api.github.com/orgs/${item}`, {
  //             method: 'GET',
  //             mode: 'cors',
  //             headers: {
  //               'Content-Type': 'application/json',
  //               'Authorization': `Bearer ${config.OAUTH}`
  //             }
  //           })
  //           .then( res =>{
  //             return res.json();
  //           })
  //           .catch( error =>{
  //             console.error( error );
  //             return {error: 'Organizations not Found!'}
  //           })
  //         );
  //       }))
  //     })
  //     .then( res =>{
  //       return res;
  //     })
  //     .catch(error => {
  //       console.error(error);
  //       res.status(404).send('Bad Request');
  //     })
  //   );
  // },

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
        return preRender({ repo: res });
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
          let original = item
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
                //set a new object in object that holds all contributors and their contributions
                original['contributorsList'] = res;
                return res.filter( contributor => contributor.login === config.user );
              })
              .then( res =>{
                if(res.length <= 0){
                  //if no contributions in repo were made, set original item to null
                  original = null;
                }
                return original;
              })
              .catch( error =>{
                console.error( error );
                return {error: 'Organizations not Found!'}
              })
          );
        }));
      })
      .then( res =>{
        //filter out all null values in arrray
        return res.filter( item => item);
      })
      .then( res =>{
        //Did the user make no contributions to the organization???
        if(res.length === 0){
          res = ["There are No Contributions for this User!"];
        }
        return preRender({ org : res });
      })
      .catch(error => {
        console.error(error);
        res.status(404).send('Bad Request');
      })
    );
  },
}

export default renderFetch;