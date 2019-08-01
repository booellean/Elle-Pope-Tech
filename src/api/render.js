import React from 'react';
import fetch from 'isomorphic-fetch';
import config from './config';

// Need to stringify data before it is sent to the server, some sort of bug in the package returns it as an array
const preRender = (data) =>{
  return JSON.stringify(data);
}

const renderFetch = {
  renderAllRepos : async (req, url, page, arr=[]) =>{
    let fullArray = arr;
    return(
      fetch(`${url}&page=${page}&per_page=${config.perPage}`, {
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
        fullArray.push(...res);
        if(res.length === config.perPage){
          return renderFetch.renderAllRepos(req, url, page+1, fullArray);
        }else{
          let personalRepos = fullArray.filter( item => {
            return item.owner.login === config.user && item.fork === false && item.private !== true;
          });
          // let contribRepos = fullArray.filter( item =>{
          //   return item.owner.login !== config.user || item.fork === true;
          // });

          // let finalObj = { 'repos' : personalRepos, 'open-source': contribRepos};
          let finalObj = {'repos' : { 'repos' : personalRepos } };
          return preRender(finalObj);
        }
      })
      .catch(error => {
        console.error(error);
      })
    );
  },

  renderRepoUrlRequests : async (url, page, name, arr=[]) =>{
    let fullArray = arr;
    return(
      fetch(`${url}?page=${page}&per_page=${config.perPage}`, {
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
        //If item is not array, error was thrown. return empty array
        if(!Array.isArray(res)){
          res = [res];
          return res;
        }

        //Otherwise push contents to array item and send all items to
        fullArray.push(...res);
        if(res.length === config.perPage){
          return renderFetch.renderRepoUrlRequests(url, page+1, name, fullArray);
        }else{
          return fullArray;
        }
      })
      .catch(error => {
        console.error(error);
        return [];
      })
    )
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
      })
    );
  },

  renderContribRepos : async (req, arr) =>{
      // let allRequests = Promise.all( arr.map( item =>{
      return Promise.all( arr.map( item =>{
        let org = item;
        return(
          fetch(`https://api.github.com/orgs/${org}`, {
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
          .then( res =>{
            if(res.message) return;
            let orgObj = { org: res };
            return(
              fetch(`https://api.github.com/orgs/${org}/repos`, {
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
              .then( res =>{
                orgObj.repos = res;
                return orgObj;
              })
              .then( res =>{
                let orgObj = res;
                // let repos =  res.repos.map( item =>{
                return Promise.all( res.repos.map( item =>{
                  let repo = item;
                  return (
                    fetch(`${repo['contributors_url']}`, {
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
                      repo['contributorsList'] = res;
                      return res.filter( contributor => contributor.login === config.user );
                    })
                    .then( res =>{
                      if(res.length <= 0) return;
                      return repo;
                    })
                    .catch( error =>{
                      console.error( error );
                      return {error: 'Organizations not Found!'}
                    })
                  );
                }))
                .then( res =>{
                  //get rid of null values
                  orgObj.repos = res.filter( item => item);
                  return orgObj;
                })
              })
              .catch( error =>{
                console.error( error );
                return {error: 'Organizations not Found!'}
              })
            );
          })
          .catch( error =>{
            console.error( error );
            return {error: 'Organizations not Found!'}
          })
        );
      }))
      .then( res =>{
        //get rid of null values
        return res.filter( item => item);
      })
      .then( res =>{
        return preRender( { 'open-source' : { 'repos' : res } } );
      })
      .catch( error =>{
        console.error( error );
        return {error: 'Organizations not Found!'}
      })
  },

//TODO: combine two functions below, they are really similar

  renderRepoInfo : (reqId, url) =>{
    return (
      renderFetch.renderAllRepos(reqId, url, 1)
        .then( res =>{
          //Un-preRender it
          return JSON.parse(res);
        })
        .then( res =>{
          let currentRepo = res['repos'].repos.filter( item =>{
            return item.name.toLowerCase() === reqId.toLowerCase();
          })
          return preRender({ 'repos' : res['repos'], 'repo' : currentRepo[0] });
        })
    );
  },

  renderOrgInfo : (reqId, arr) =>{
    return (
      renderFetch.renderContribRepos(reqId, arr)
        .then( res =>{
          //Un-preRender it
          return JSON.parse(res);
        })
        .then( res =>{
          console.log(res);
          let currentOrg = res['open-source'].repos.filter( item =>{
            return item.org.login.toLowerCase() === reqId.toLowerCase();
          })
          let obj = { 'open-source': res['open-source'], 'org' : currentOrg[0] };
          console.log(obj);
          return preRender(obj);
        })
    );
  }
}

export default renderFetch;