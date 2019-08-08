import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import RepoNode from './RepoNodeComponent';
import renderFetch from '../../api/render';
import Language from './SnippetLanguageComponent';
import Contributor from './SnippetContribComponent';
import Commit from './SnippetCommitComponent';

class ContribRepo extends Component {
  constructor(props){
    super(props);

    this.state = {
      info : null,
      copy : null,
      ascending : {
        create : true,
        commit : true,
        orgAlpha : true,
        repoAlpha : true,
      },
      currentLang : 'reset',
      languages : {}
    }
  }

  componentDidMount(){
    if(this.props.data !== null){
      this.setState({ info: this.props.data['repos'] });
      this.setState({ copy: this.props.data['repos'] });
      if(!this.props.data['languages-in-repos']){
        return this.setRepoValues(this.props.data['repos']);
      }
      return this.setState({ languages: this.props.data['languages-in-repos'] || {} });
    }else{
      let stateCopy;
      return this.props.updateInitialState(this.props.fetchInitialData)
              .then( data =>{
                let repos = data[this.props.name].repos;
                this.setState({ info: repos });
                this.setState({ copy: repos });

                return this.setRepoValues(repos);
              });
    }
  }

  //Functions that manipulate data/behavior

  setRepoValues = (repos) =>{
    let stateCopy = repos;

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
  }

  addToState = (getDat, url, name, repo) =>{
    return this.props.updatePartofStateArray(getDat, url, name, repo, 'open-source')
      .then( data =>{
        this.setState({ languages : data.languages });
        return data.data;
      });
  }

  sortLanguage = (e, lang) =>{
    e.preventDefault();
    if(lang === 'reset'){
      return this.setState({ copy : this.state.info })
    }
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

    console.log(filteredLangs);

    this.setState({ copy : filteredLangs });
    this.setState({ currentLang : lang });
  }

  sortByDate = (e, type, state) =>{
    e.preventDefault();

    this.state.info.sort( (orgA, orgB) =>{
      orgA.repos.sort( (a, b) =>{
        if(this.state.ascending[state] === true){
          return new Date(a[type]) < new Date(b[type]) ? 1 : -1;
          }
          return new Date(a[type]) > new Date(b[type]) ? 1 : -1;
        })
        orgB.repos.sort( (a, b) =>{
          if(this.state.ascending[state] === true){
            return new Date(a[type]) < new Date(b[type]) ? 1 : -1;
            }
            return new Date(a[type]) > new Date(b[type]) ? 1 : -1;
          })

        //If array is empty, set the type for sorting porposes
        if(orgA.repos.length === 0){
          orgA.repos[0] = { [type] : '1900-01-01T01:00:00Z' };
        }
        if(orgB.repos.length === 0){
          orgB.repos[0] = { [type] : '1900-01-01T01:00:00Z' };
        }

        if(this.state.ascending[state] === true){
          return orgA.repos[0][type] < orgB.repos[0][type] ? 1 : -1;
        }
        return orgA.repos[0][type] > orgB.repos[0][type] ? 1 : -1;
    });

    //Reset empty arrays to avoid React rendering problems in code
    this.state.info.forEach( org =>{
      if(org.repos[0][type] === '1900-01-01T01:00:00Z'){
        org.repos = [];
      }
    })

    console.log(this.state.ascending[state]);
    this.sortLanguage(e, this.state.currentLang);

    return this.state.ascending[state] = !this.state.ascending[state];
  }

  sortByName = (e, type, state) =>{
    e.preventDefault();

    //Sort by Org Name and/or by repo name
    switch(type){
      case 'org':
        this.state.info.sort( (orgA, orgB) =>{
          if(this.state.ascending[state] === true){
            return orgA.org.name < orgB.org.name ? 1 : -1;
          }
          return orgA.org.name > orgB.org.name ? 1 : -1;
        })
        break;
      case 'repo':
          this.state.info.forEach( (org) =>{
            org.repos.sort( (a, b) =>{
              if(this.state.ascending[state] === true){
                return a.name < b.name ? 1 : -1;
                }
                return a.name > b.name ? 1 : -1;
              })
          });
        break;
      default:
        console.log('okay, whatever, I will figure it out later');
    }
    this.sortLanguage(e, this.state.currentLang);
    return this.state.ascending[state] = !this.state.ascending[state];
  }

  //Functions that create nodes

  createLanguagesList = (langs) =>{
    let keys = Object.keys(langs);

    if(keys.length === 0){
      return <li>Loading...</li>;
    }
     return keys.map( key =>{
      return <li key={key} onClick={(e) => this.sortLanguage(e, key)}>{key} ({langs[key]})</li>
    })
  }

  createSortIcon = (name) =>{
    if(!this.state.ascending[name]){
      return <i className="fas fa-sort-up"></i>;
    }
    return <i className="fas fa-sort-down"></i>;
  }

  render(){

   if(!this.state.copy){
     //Put Loading bar here;
     return false;
   }else{
    const listItems = this.state.copy.map( item => {
      let options = {weekday: "long", month: "short", day: "numeric", hour: "numeric", minute: "2-digit", year: "numeric", };
        return(
          <li className="org-info" key={item.org.login}>
            <Link to={`/${this.props.name}/${item.org.login}`}>
              {item.org.avatar_url ? (
                <img src={item.org.avatar_url} alt="Organization Avatar"/>
              ) : null}
              <h2>{item.org.name}</h2>
            </Link>
            {item.org.type !== "" ? (
              <p>{item.org.type}</p>
            ) : null}
            {item.org.description !== "" ? (
              <p>{item.org.description}</p>
            ) : null}
            <dl>
              <dt>Operating since</dt><dd>{new Date(item.org["created_at"]).toLocaleDateString('en-US', options)}</dd>
              {item.org.blog !== "" ? (
                <React.Fragment>
                  <dt>Blog</dt><dd>{item.org.blog}</dd>
                </React.Fragment>
              ) : null}
              {item.org["public_repos"] === 0 || item.repos.length === 0 ? (
                <p>Looks like all the contributions are private!  Please ask the Author directly about contributions to this Organization.</p>
              ) :(
                <React.Fragment>
                  <dt>Public Projects</dt><dd>{item.org["public_repos"]}</dd>
                  <dt>Author Contributions</dt><dd>{item.repos.length}</dd>
                </React.Fragment>
              )}

            </dl>

            {item.repos.length !== 0 ? (
            <h3>Repos Contributed To:</h3>
            ) : null}
            {item.repos.map( item =>{
              return <RepoNode item={item} name={this.props.name} />
            })}
          </li>
        );
      });

      return(
        <React.Fragment>
          <header id='page-header'>
          <h2 onClick={(e) => this.sortLanguage(e, 'reset')} >Languages</h2>
          <p onClick={(e) => this.sortByDate(e, 'created_at', 'create')}>
            Created On {this.createSortIcon('create')}
          </p>
          <p onClick={(e) => this.sortByDate(e, 'updated_at', 'commit')}>
            Commit Date {this.createSortIcon('commit')}
            </p>
          <br/>
          <p onClick={(e) => this.sortByName(e, 'org', 'orgAlpha')} >
            Sort by Org Name {this.createSortIcon('orgAlpha')} </p>
          <p onClick={(e) => this.sortByName(e, 'repo', 'repoAlpha')}>
            Sort by Repo Name {this.createSortIcon('repoAlpha')}</p>
          <ul>
            {this.createLanguagesList(this.state.languages)}
          </ul>
          </header>
          <article id="content">
            <ul>
              {listItems}
            </ul>
          </article>
        </React.Fragment>
      );
    }
  }
}

export default ContribRepo;