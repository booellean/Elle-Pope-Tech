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
      languages : {}
    }
  }

  componentDidMount(){
    if(this.props.data !== null){
      this.setState({ info: this.props.data['repos'] });
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
                  r.repos.map( repo =>{
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
                  })
                })

                let  commitRequest = repos.map( r =>{
                  r.repos.map( repo =>{
                    return this.props.updatePartofStateArray(renderFetch.renderRepoUrlRequests, repo['commits_url'].split('{')[0], 'total_commits', repo, 'open-source')
                      .then( data =>{
                        repo['total_commits'] = data.data;
                        stateCopy[stateCopy.indexOf(repo)] = repo;
                      })
                    })
                });

                let contribRequest = repos.map( r =>{
                  r.repos.map( repo =>{
                  return this.props.updatePartofStateArray(renderFetch.renderRepoUrlRequests, repo['contributors_url'], 'total_contributors', repo,'open-source')
                    .then( data =>{
                      repo['total_contributors'] = data.data;
                      stateCopy[stateCopy.indexOf(repo)] = repo;
                    })
                  })
                })

                return Promise.all(languageRequest, commitRequest, contribRequest)
                              .then( res =>{
                                this.setState({ info: stateCopy });
                              })
              });
    }
  }

  addToState = (getDat, url, name, repo) =>{
    return this.props.updatePartofStateArray(getDat, url, name, repo, 'open-source')
      .then( data =>{
        if(this.state.info.indexOf(repo) === (this.state.info.length - 1)){
          this.setState({ languages : data.languages });
        }
        return data.data;
      });
  }

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

  render(){

   if(!this.state.info){
     //Put Loading bar here;
     return false;
   }else{
    const listItems = this.state.info.map( item => {
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
            {JSON.stringify(this.state.languages)}
            <h2>Languages</h2>
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