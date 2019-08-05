import React, { Component } from 'react';
import Language from './SnippetLanguageComponent';
import Contributor from './SnippetContribComponent';
import Commit from './SnippetCommitComponent';
import temp from '../temp.gif';

class Home extends Component {
  constructor(props){
    super(props);

    this.state = {
      info : this.props.data,
      bio : 'Eventually, a bio will go here'
    }
  }

  componentDidMount(){
    if(this.props.data !== null){
      console.log(this.props.data);
      this.setState({ info: this.props.data[0] });
    }else{
      return this.props.fetchInitialData()
          .then( data =>{
            let newDat = JSON.parse(data);
            this.setState({ info: newDat[this.props.name][0] });
            this.props.updateInitialState(newDat);
          });
    }
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
          <Language repo={item} addToState={this.addToState.bind(this)} name='total_languages' title='Languages' url={item['languages_url']}/>
          <Commit repo={item} addToState={this.addToState.bind(this)} name='total_commits' title='Commits' url={item['commits_url'].split('{')[0]}/>
          <Contributor repo={item} addToState={this.addToState.bind(this)} name='total_contributors' title='Contributors' url={item['contributors_url']}/>
        </details>
      </li>
    );
  }

  render(){

   if(!this.state.info){
     return(
      <React.Fragment>
        <header id='page-header'>
        </header>
        <img src={temp} alt="loading cat is loading the page now!"></img>
      </React.Fragment>
     );
   }else{
      return(
        <React.Fragment>
          <header id='page-header'>
            <img src={this.state.info.avatar_url} alt="I professional picture of Elle Pope a.k.a. booellean"/>
            <h2><a href={this.state.info.html_url} target="_blank">{this.state.info.login}</a></h2>
            <p>{this.state.info.bio}</p>
            <p>Repos : {this.state.info.public_repos + this.state.info.total_private_repos}</p>
          </header>
          <article id="content">
            {this.state.bio}
          </article>
        </React.Fragment>
      );
    }
  }
}

export default Home;