import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Language from './SnippetLanguageComponent';
import Contributor from './SnippetContribComponent';
import Commit from './SnippetCommitComponent';

class Repo extends Component {
  constructor(props){
    super(props);

    this.state = {
      repo : null
    }
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

    if(!this.props.data){
      let updateProp = this.props.updatePartofState(repo, stateName, state);
      this.setState({ repo: updateProp });
    }else{
      if(this.props.data.name === repo){
        this.setState({ repo: this.props.data });
      }else{
        let updateProp = this.props.updatePartofState(repo, stateName, state, this.props.fetchInitialData);
        this.setState({ repo: updateProp });
      }
    }

  }

  render(){

   if(!this.props){
     //Put Loading bar here;
     return false;
   }else{
    // const listItems = this.state.info.map( item => {
    //     return(
    // //       this.createRepoNode(item)
    // <Language repo={item} addToState={this.addToState.bind(this)} name='total_languages' title='Languages' url={item['languages_url']}/>
    // <Commit repo={item} addToState={this.addToState.bind(this)} name='total_commits' title='Commits' url={item['commits_url'].split('{')[0]}/>
    // <Contributor repo={item} addToState={this.addToState.bind(this)} name='total_contributors' title='Contributors' url={item['contributors_url']}/>
    //     );
    //   });

      return(
        <React.Fragment>
          <header id='page-header'>
            <h2>Languages</h2>
          </header>
            <ul>
              {/* {listItems} */}
            </ul>
        </React.Fragment>
      );
    }
  }
}

export default Repo;