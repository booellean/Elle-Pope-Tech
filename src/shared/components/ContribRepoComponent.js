import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import renderFetch from '../../api/render';
import Language from './SnippetLanguageComponent';
import Contributor from './SnippetContribComponent';
import Commit from './SnippetCommitComponent';
import Page from './PageComponent';

class ContribRepo extends Component {
  constructor(props){
    super(props);

    this.state = {
      info : null,
      copy : null,
      languages : {}
    }
  }

  componentDidMount(){
    if(this.props.data !== null){
      this.setState({ info: this.props.data['repos'] });
      this.setState({ copy: this.props.data['repos'] });
      this.setState({ languages: this.props.data['languages-in-repos'] || {} });
    }else{
      let stateCopy;
      return this.props.updateInitialState(this.props.fetchInitialData)
              .then( data =>{
                stateCopy = data[this.props.name].repos;
                return data;
              })
              .then( data =>{
                let repos = data[this.props.name].repos;

                let languageRequest = repos.map( r =>{
                  return Promise.all(r.repos.map( repo =>{
                    return this.props.updatePartofStateArray(renderFetch.renderRepoUrlRequests, repo['languages_url'], 'total_languages', repo, 'open-source')
                    .then( data =>{
                      repo['total_languages'] = data.data;
                      let i = stateCopy.indexOf(r);
                      let j = stateCopy[i].repos.indexOf(repo);

                      stateCopy[i].repos[j] = repo;
                      if( j === stateCopy[i].repos.length -1 ){
                        this.setState({ languages : data.languages });
                      }
                    });
                  }))
                })

                let  commitRequest = repos.map( r =>{
                  return Promise.all(r.repos.map( repo =>{
                    return this.props.updatePartofStateArray(renderFetch.renderRepoUrlRequests, repo['commits_url'].split('{')[0], 'total_commits', repo, 'open-source')
                      .then( data =>{
                        repo['total_commits'] = data.data;
                        stateCopy[stateCopy.indexOf(repo)] = repo;
                      })
                    }))
                });

                let contribRequest = repos.map( r =>{
                  return Promise.all(r.repos.map( repo =>{
                  return this.props.updatePartofStateArray(renderFetch.renderRepoUrlRequests, repo['contributors_url'], 'total_contributors', repo,'open-source')
                    .then( data =>{
                      repo['total_contributors'] = data.data;
                      stateCopy[stateCopy.indexOf(repo)] = repo;
                    })
                  }))
                })

                return Promise.all(languageRequest, commitRequest, contribRequest)
                              .then( res =>{
                                return res
                              })
                              .then( res =>{
                                console.log(res);
                                this.setState({ info: stateCopy });
                                this.setState({ copy: stateCopy });
                              })
              });
    }
  }

  //Functions that manipulate data/behavior

  addToState = (getDat, url, name, repo) =>{
    return this.props.updatePartofStateArray(getDat, url, name, repo, 'open-source')
      .then( data =>{
        this.setState({ languages : data.languages });
        return data.data;
      });
  }

  sortLanguage = (e, lang) =>{
    e.preventDefault();
    let filteredLangs =  this.state.info.map( org =>{
      let orgRepos =  org.repos.filter( repo => {
        return repo['total_languages'][0].hasOwnProperty(lang);
      })
      if(orgRepos.length > 0){
        return { org : org.org, repos : orgRepos};
      }
      return null;
    });

    filteredLangs = filteredLangs.filter( arr => arr );

    this.setState({ copy : filteredLangs })
  }

  //Functions that create nodes

  createRepoNode = (item) =>{
    return(
      <li key={item.id}>
        <Link to={`/${this.props.name}/${item['name']}`}>
          <h3>{item['name']}</h3>
        </Link>
        <p>{item['description']}</p>
        <details>
          <p>Size: {item['size']}</p>
          <p>Created: {item['created_at']}</p>
          <p>Last Commit: {item['updated_at']}</p>
          <Language repo={item} addToState={this.addToState.bind(this)} name='total_languages' title='Languages' url={item['languages_url']}/>
          <Commit repo={item} addToState={this.addToState.bind(this)} name='total_commits' title='Commits' url={item['commits_url'].split('{')[0]}/>
          <Contributor repo={item} addToState={this.addToState.bind(this)} name='total_contributors' title='Contributors' url={item['contributors_url']}/>
        </details>
      </li>
    );
  }

  createLanguagesList = (langs) =>{
    let keys = Object.keys(langs);

    if(keys.length === 0){
      return <li>Loading...</li>;
    }
     return keys.map( key =>{
      return <li key={key} onClick={(e) => this.sortLanguage(e, key)}>{key} ({langs[key]})</li>
    })
  }

  render(){

   if(!this.state.copy){
     //Put Loading bar here;
     return false;
   }else{
    const listItems = this.state.copy.map( item => {
        return(
          <ul>
        <Link to={`/${this.props.name}/${item.org.login}`}>
          <h3>{item.org.name}</h3>
        </Link>
            {item.repos.map( repo =>{
              return this.createRepoNode(repo);
            })}
          </ul>
        );
      });

      return(
        <React.Fragment>
          <main id='main'>
          <header id='page-header'>
          <h2>Languages</h2>
          <ul>
            {this.createLanguagesList(this.state.languages)}
          </ul>
          </header>
            <Page />
            <ul>
              {listItems}
            </ul>
          </main>
        </React.Fragment>
      );
    }
  }
}

export default ContribRepo;