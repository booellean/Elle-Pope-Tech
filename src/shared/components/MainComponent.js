import React, { Component } from 'react';
import Snippet from './SnippetComponent';
import Page from './PageComponent';

class Main extends Component {
  constructor(props){
    super(props);

    this.state = {
      info : this.props.data
    }
  }

  componentDidMount(){
    if(this.props.data !== null){
      // return this.setState({ info: this.props.data });
      this.setState({ info: this.props.data });
      // return console.log(this.state.info);
    }else{
      return this.props.fetchInitialData()
          .then( data =>{
            let newDat = JSON.parse(data);
            this.setState({ info: newDat[this.props.name] });
            this.props.updateTheState(newDat);
            // return console.log(this.state.info);
          });
    }
  }

  addToState = (data, name, repo) =>{
    //update state when function is called for first time
    //this.props.updateTheState will be used, activated from Snippet
    //console.log(data, name, repo);
  }

  createRepoNode = (item) =>{
    return(
      <li key={item.id}>
        <a href={item['html_ulr']} target="_blank"><h3>{item['name']}</h3></a>
        <p>{item['description']}</p>
        <details>
          <p>Size: {item['size']}</p>
          <p>Created: {item['created_at']}</p>
          <p>Last Commit: {item['updated_at']}</p>
          <Snippet repo={item} addToState={this.addToState.bind(this)} name='total_languages' title='Languages' url={item['languages_url']}/>
          <Snippet repo={item} addToState={this.addToState.bind(this)} name='total_commits' title='Commits' url={item['commits_url'].split('{')[0]}/>
          <Snippet repo={item} addToState={this.addToState.bind(this)} name='total_contributors' title='Contributors' url={item['contributors_url']}/>
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
          this.createRepoNode(item)
        );
      });

      return(
        <React.Fragment>
          <main id='main'>
          <header id='page-header'>
            <h2>This is the {this.props.title} Page</h2>
            <ul>
              {listItems}
            </ul>
          </header>
            <Page />
          </main>
        </React.Fragment>
      );
    }
  }
}

export default Main;