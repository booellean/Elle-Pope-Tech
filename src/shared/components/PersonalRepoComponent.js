import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import renderFetch from '../../api/render';
import Language from './SnippetLanguageComponent';
import Contributor from './SnippetContribComponent';
import Commit from './SnippetCommitComponent';

class PersonalRepo extends Component {
  constructor(props){
    super(props);

    this.state = {
      info : null,
      copy : null,
      ascending : {
        create : true,
        commit : true,
        alpha : true,
      },
      currentLang : 'reset',
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

                let languageRequest = repos.map( repo =>{
                  return this.props.updatePartofStateArray(renderFetch.renderRepoUrlRequests, repo['languages_url'], 'total_languages', repo, 'repos')
                    .then( data =>{
                      repo['total_languages'] = data.data;
                      stateCopy[stateCopy.indexOf(repo)] = repo;
                      console.log('languages!');
                      if(stateCopy.indexOf(repo) === (stateCopy.length - 1)){
                        this.setState({ languages : data.languages });
                      }
                    });
                })

                let  commitRequest = repos.map( repo =>{
                  return this.props.updatePartofStateArray(renderFetch.renderRepoUrlRequests, repo['commits_url'].split('{')[0], 'total_commits', repo, 'repos')
                    .then( data =>{
                      repo['total_commits'] = data.data;
                      stateCopy[stateCopy.indexOf(repo)] = repo;
                    })
                });

                let contribRequest = repos.map( repo =>{
                  return this.props.updatePartofStateArray(renderFetch.renderRepoUrlRequests, repo['contributors_url'], 'total_contributors', repo,'repos')
                    .then( data =>{
                      repo['total_contributors'] = data.data;
                      stateCopy[stateCopy.indexOf(repo)] = repo;
                    })
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
    return this.props.updatePartofStateArray(getDat, url, name, repo, 'repos')
      .then( data =>{
        if(this.state.info.indexOf(repo) === (this.state.info.length - 1)){
          this.setState({ languages : data.languages });
        }
        return data.data;
      });
  }

  sortLanguage = (e, lang) =>{
    e.preventDefault();
    if(lang === 'reset'){
      return this.setState({ copy : this.state.info })
    }
    let filteredLangs =  this.state.info.filter( repo =>{
        return repo['total_languages'][0].hasOwnProperty(lang);
    });

    filteredLangs = filteredLangs.filter( arr => arr );

    this.setState({ copy : filteredLangs });
    this.setState({ currentLang : lang });
  }

  sortByDate = (e, type, state) =>{
    e.preventDefault();

    this.state.info.sort( (a, b) =>{
        if(this.state.ascending[state] === true){
          return new Date(a[type]) < new Date(b[type]) ? 1 : -1;
          }
          return new Date(a[type]) > new Date(b[type]) ? 1 : -1;
    });

    this.sortLanguage(e, this.state.currentLang);
    return this.state.ascending[state] = !this.state.ascending[state];
  }

  sortByName = (e, state) =>{
    e.preventDefault();

    //Sort by repo name
    this.state.info.sort( (a, b) =>{
      if(this.state.ascending[state] === true){
        return a.name < b.name ? 1 : -1;
        }
        return a.name > b.name ? 1 : -1;
    });

    this.sortLanguage(e, this.state.currentLang);
    return this.state.ascending[state] = !this.state.ascending[state];
  }

  //Functions that create nodes

  createRepoNode = (item) =>{
    return(
      <li className="repo-info" key={item.id}>
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
          this.createRepoNode(item)
        );
      });

      return(
        <React.Fragment>
          <header id='page-header'>
            <h2 onClick={(e) => this.sortLanguage(e, 'reset')} >Languages</h2>
            <p onClick={(e) => this.sortByDate(e, 'created_at', 'create')}>Created Date</p>
            <p onClick={(e) => this.sortByDate(e, 'updated_at', 'commit')}>Commit Date</p>
            <br/>
            <p onClick={(e) => this.sortByName(e, 'alpha')}>Sort by Repo Name</p>
            {this.createLanguagesList(this.state.languages)}
          </header>
            <ul>
              {listItems}
            </ul>
        </React.Fragment>
      );
    }
  }
}

export default PersonalRepo;