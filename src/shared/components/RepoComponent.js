import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Language from './SnippetLanguageComponent';
import Contributor from './SnippetContribComponent';
import Commit from './SnippetCommitComponent';
import Page from './PageComponent';

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
      state = 'open-source';
    }

    if(!this.props.data){
      let updateProp = this.props.updatePartofState(repo, stateName, state);
      return this.setState({ repo: updateProp });
    }else{
      if(this.props.data.name === repo){
        return this.setState({ repo: this.props.data });
      }else{
        let updateProp = this.props.updatePartofState(repo, stateName, state, this.props.fetchInitialData);
        return this.setState({ repo: updateProp });
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
    //       this.createRepoNode(item)
    //     );
    //   });

      return(
        <React.Fragment>
          <main id='main'>
          <header id='page-header'>
            <h2>Languages</h2>
          </header>
            <Page />
            <ul>
              {/* {listItems} */}
            </ul>
          </main>
        </React.Fragment>
      );
    }
  }
}

export default Repo;