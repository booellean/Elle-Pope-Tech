import React from 'react';
import fetch from 'isomorphic-fetch';
import config from './config';
import { resolve } from 'path';

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
  renderAllRepos : async (req, url, page, arr) =>{
    return renderFetch.renderRepos(req, url, page, arr)
    .then( res =>{
      let arr = res;
      let promiseArr = arr.map( repo =>{
        return renderFetch.renderRepoUrlRequests(repo['commits_url'].split('{')[0], 1, repo, 'total_commits')
                          .then( res =>{
                            return res;
                          })
                          .catch(error => {
                            console.error(error);
                            return [];
                          })
      });
      return Promise.all(promiseArr).then( arr =>{
        return arr;
      })
      .then( arr=>{
        console.log(arr);
        let personalRepos = arr.filter( item => {
          return item.owner.login === config.user && item.fork === false && item.private !== true;
        });
        let contribRepos = arr.filter( item =>{
          return item.owner.login !== config.user || item.fork === true;
        });

        let finalObj = { 'repos' : personalRepos, 'open-source': contribRepos};
        return preRender(finalObj);
      } );
    })
    .then( arr =>{
      console.log(arr);
      let personalRepos = arr.filter( item => {
        return item.owner.login === config.user && item.fork === false && item.private !== true;
      });
      let contribRepos = arr.filter( item =>{
        return item.owner.login !== config.user || item.fork === true;
      });

      let finalObj = { 'repos' : personalRepos, 'open-source': contribRepos};
      return preRender(finalObj);
    })
    // .then( arr =>{
    //   console.log(arr);
    //   let personalRepos = arr.filter( item => {
    //     return item.owner.login === config.user && item.fork === false && item.private !== true;
    //   });
    //   let contribRepos = arr.filter( item =>{
    //     return item.owner.login !== config.user || item.fork === true;
    //   });

    //   let finalObj = { 'repos' : personalRepos, 'open-source': contribRepos};
    //   return preRender(finalObj);
    // })
          //  .then( arr =>{
          //    console.log(arr);
          // //    return Promise.all(arr.forEach( async repo =>{
          // //     await renderFetch.renderRepoUrlRequests(repo['commits_url'].split('{')[0], 1)
          // //       .then( res =>{
          // //         console.log(res);
          // //         return res.json();
          // //       })
          // //       .then( res =>{
          // //         repo['total_commits'] = res;
          // //         console.log(repo['total_commits']);
          // //         return repo;
          // //       })
          // //       .catch(error => {
          // //         console.error(error);
          // //         res.status(404).send('Bad commits request');
          // //         return [];
          // //       })
          // //    }));
          // //  })
          //  .then( arr =>{
          //   //  console.log(arr);
          //   //   let personalRepos = arr.filter( item => {
          //   //     return item.owner.login === config.user && item.fork === false && item.private !== true;
          //   //   });
          //   //   let contribRepos = arr.filter( item =>{
          //   //     return item.owner.login !== config.user || item.fork === true;
          //   //   });

          //   //   let finalObj = { 'repos' : personalRepos, 'open-source': contribRepos};
          //   //   return preRender(finalObj);
          //  })
           .catch(error => {
            console.error(error);
          })
  },

  renderRepos : async (req, url, page, arr=[]) =>{
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
          return renderFetch.renderRepos(req, url, page+1, fullArray);
        }else{
          console.log(fullArray);
          return fullArray;
        }
      })
      .catch(error => {
        console.error(error);
      })
    );
  },

  renderRepoUrlRequests : async (url, page, repo, name, arr=[]) =>{
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
          res = [];
          return res;
        }

        //Otherwise push contents to array item and send all items to
        fullArray.push(...res);
        if(res.length === config.perPage){
          return renderFetch.renderRepoUrlRequests(url, page+1, repo, name, fullArray);
        }else{
          repo[name] = fullArray;
          return repo;
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
      fetch(`https://api.github.com/repos/${config.user}/${reqId}`, {
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
        return preRender({ repo: [res] });
      })
      .catch(error => {
        console.error(error);
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
      })
    );
  },
}

export default renderFetch;

          //get commits for each repo
          // let getCommits = fullArray.forEach( async repo =>{
          //   await renderFetch.renderRepoUrlRequests(repo['commits_url'].split('{')[0], 1)
          //           .then( res =>{
          //             return res.json();
          //           })
          //           .then( res =>{
          //             repo['total_commits'] = res;
          //             return repo;
          //           })
          //           .catch(error => {
          //             console.error(error);
          //             res.status(404).send('Bad commits request');
          //             return [];
          //           })
          // });
          //get contributors for each repo
          // let getContributors = fullArray.forEach( repo =>{
          //   return renderFetch.renderRepoUrlRequests(repo['collaborators_url'].split('{')[0], 1)
          //           .then( res =>{
          //             console.log(res);
          //             return res.json();
          //           })
          //           .then( res =>{
          //             repo['total_collaborators'] = res;
          //             return repo;
          //           })
          //           .catch(error => {
          //             console.error(error);
          //             res.status(404).send('Bad commits request');
          //             return [];
          //           })
          // });
          // //get languages for each repo
          // let getLanguages = fullArray.forEach( repo =>{
          //   return renderFetch.renderRepoUrlRequests(repo['languages_url'], 1)
          //           .then( res =>{
          //             console.log(res);
          //             return res.json();
          //           })
          //           .then( res =>{
          //             repo['total_languages'] = res;
          //             return repo;
          //           })
          //           .catch(error => {
          //             console.error(error);
          //             res.status(404).send('Bad commits request');
          //             return [];
          //           })
          // });

          // return Promise.all(getCommits)
          // .then( data =>{
          //   console.log(data);

          //   let personalRepos = fullArray.filter( item => {
          //     return item.owner.login === config.user && item.fork === false && item.private !== true;
          //   });
          //   let contribRepos = fullArray.filter( item =>{
          //     return item.owner.login !== config.user || item.fork === true;
          //   });

          //   let finalObj = { 'repos' : personalRepos, 'open-source': contribRepos};
          //   return preRender(finalObj);
          // })

          // let personalRepos = fullArray.filter( item => {
          //   return item.owner.login === config.user && item.fork === false && item.private !== true;
          // });
          // let contribRepos = fullArray.filter( item =>{
          //   return item.owner.login !== config.user || item.fork === true;
          // });

          // let finalObj = { 'repos' : personalRepos, 'open-source': contribRepos};
          // return preRender(finalObj);