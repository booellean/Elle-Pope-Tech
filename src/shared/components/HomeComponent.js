import React, { Component } from 'react';
import Language from './SnippetLanguageComponent';
import Contributor from './SnippetContribComponent';
import Commit from './SnippetCommitComponent';
import Page from './PageComponent';

class Home extends Component {
  constructor(props){
    super(props);

    this.state = {
      info : this.props.data,
      languages : {}
    }
  }

  componentDidMount(){
    if(this.props.data !== null){
      this.setState({ info: this.props.data });
      this.setState({ languages: this.props.data['total_languages'] || {} });
    }else{
      return this.props.fetchInitialData()
          .then( data =>{
            let newDat = JSON.parse(data);
            this.setState({ info: newDat[this.props.name] });
            this.props.updateInitialState(newDat);
          });
    }
  }

  // addToState = (data, name, repo) =>{
  //   this.props.updatePartofStateArray(data, name, repo, 'open-source');

  //   if(name === 'total_languages''){
  //     let keys = Object.keys(data[0]);

  //     let stateCopy = this.state.languages;
  //     keys.forEach( key =>{
  //       stateCopy[key] = (stateCopy[key] +1) || 1;
  //     })
  //     this.setState({ languages : stateCopy });
  //   }
  // }

  createRepoNode = (item) =>{
    return(
      <li key={item.id}>
        <a href={item['html_ulr']} target="_blank"><h3>{item['name']}</h3></a>
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
          JSON.stringify(item)
        );
      });

      return(
        <React.Fragment>
          <main id='main'>
          <header id='page-header'>
            {JSON.stringify(this.state.languages)}
            <h2>This is the Home Component</h2>
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

export default Home;