import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import RepoNode from './RepoNodeComponent';
import Language from './SnippetLanguageComponent';
import Contributor from './SnippetContribComponent';
import Commit from './SnippetCommitComponent';

class Repo extends Component {
  constructor(props){
    super(props);

    this.state = {
      repo : null,
      loc : null,
      path : null
    }

    if(this.props.data){
      this.state.repo = this.props.data;
    }
    this.state.loc = this.props.name;
  }


  componentDidMount(){
    let path = window.location.pathname.split('/')
    let repo = path[path.length - 1];
    let stateName = path[path.length - 2];
    let state;
    if(stateName === 'repos'){
      state = 'repo';
    }else{
      state = 'org';
    }

    this.state.path = stateName;
    console.log(this.state.path);

    if(!this.state.repo){
      let updateProp = this.props.updatePartofState(repo, stateName, state);
      this.state.repo = updateProp;
    }

  }

  addToState = (getDat, url, name, repo) =>{
    let path = window.location.pathname.split('/')
    let stateName = path[path.length - 2];

    return this.props.updatePartofStateArray(getDat, url, name, repo, stateName)
      .then( data =>{
        if(this.state.info.indexOf(repo) === (this.state.info.length - 1)){
          this.setState({ languages : data.languages });
        }
        return data.data;
      });
  }

  renderRepo = (item) =>{    
    let options = {weekday: "long", month: "short", day: "numeric", hour: "numeric", minute: "2-digit", year: "numeric", };
    let modifiedSize;

    if(item['size'] >= 1000000){
      modifiedSize = `${item['size']/1000000} GB`;
    }else if(item['size'] >= 1000){
      modifiedSize = `${item['size']/1000} MB`;
    }else if(item['size'] < 1000 && item['size'] > 0){
      modifiedSize = `${item['size']} KB`;
    }else{
      modifiedSize = `>1 KB`;
    }

    return(
      <React.Fragment>
        <a href={item["html_url"]} target="_blank"><h3>{item['name']}</h3></a>
        <p>{item['description']}</p>
        <dl>
          <dt>Size:</dt> <dd>{modifiedSize}</dd>
          <dt>Created On:</dt> <dd>{new Date(item['created_at']).toLocaleDateString('en-US', options)}</dd>
          <dt>Last Commit Date:</dt> <dd>{new Date(item['updated_at']).toLocaleDateString('en-US', options)}</dd>
        </dl>
        <Language repo={item} addToState={this.addToState.bind(this)} name='total_languages' title='Languages' url={item['languages_url']}/>
        <Commit repo={item} addToState={this.addToState.bind(this)} name='total_commits' title='Commits' url={item['commits_url'].split('{')[0]}/>
        <Contributor repo={item} addToState={this.addToState.bind(this)} name='total_contributors' title='Contributors' url={item['contributors_url']}/>
      </React.Fragment>
    );
  }

  renderContrib = () =>{
    let options = {weekday: "long", month: "short", day: "numeric", hour: "numeric", minute: "2-digit", year: "numeric", };
    let org = this.state.repo.org;

    const listItems = this.state.repo.repos.map( repo =>{
      return(
        <li>
          {this.renderRepo(repo)};
        </li>
      )
    })

    return(
      <React.Fragment>
        <a href={org['html_url']} target="_blank">
        {org.avatar_url ? (
            <img src={org.avatar_url} alt="Organization Avatar"/>
          ) : null}
          <h2>{org.name}</h2>
        </a>
        {org.type !== "" ? (
              <p>{org.type}</p>
            ) : null}
            {org.description !== "" ? (
              <p>{org.description}</p>
            ) : null}
            <dl>
              <dt>Operating since</dt><dd>{new Date(org["created_at"]).toLocaleDateString('en-US', options)}</dd>
              {org.blog !== "" ? (
                <React.Fragment>
                  <dt>Blog</dt><dd>{org.blog}</dd>
                </React.Fragment>
              ) : null}

            </dl>
        <ul>
          {this.state.repo.repos.length > 0 ? (
            {listItems} 
          ) : (
            <p>Please consult the Author about contributions to this Organization.</p>
          )}
        </ul>
      </React.Fragment>
    )
  }

  render(){

   if(!this.state.repo){
     //Put Loading bar here;
     return false;
   }else{
    //  let repo = this.state.repo.repo
    // const listItems = this.state.info.map( item => {
    //     return(
    // //       this.createRepoNode(item)
    // <Language repo={item} addToState={this.addToState.bind(this)} name='total_languages' title='Languages' url={item['languages_url']}/>
    // <Commit repo={item} addToState={this.addToState.bind(this)} name='total_commits' title='Commits' url={item['commits_url'].split('{')[0]}/>
    // <Contributor repo={item} addToState={this.addToState.bind(this)} name='total_contributors' title='Contributors' url={item['contributors_url']}/>
    //     );
    //   });
      // /console.log(this.state);
      return(
        <React.Fragment>
          <header id='page-header'>
            {this.state.loc === 'repo' ?(
              <h2>Personal</h2>
            ) : (
              <h2>Open Source</h2>
            )}
          </header>
          <article id="content">
            {this.state.loc === 'repo' ?(
              this.renderRepo(this.state.repo)
            ) : (
              this.renderContrib()
            )}
          </article>
        </React.Fragment>
      );
    }
  }
}

export default Repo;