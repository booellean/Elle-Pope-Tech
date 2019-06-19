import React, { Component } from 'react';
import Page from './PageComponent';

class Main extends Component {
  constructor(props){
    super(props);

    this.state = {
      initialData : null,
      userStats: null,
      userRepos: null,
      userContribs: null,
      repo: null,
      org: null
    }
  }

  componentDidMount(){
    // let currentPage = window.location.split('/').pop();
    console.log(window.location.pathname);
    console.log(this.props.fetchInitialData());
  }

  render(){

    const listItems = this.props.data.map(  item => {
        return(
          <li key={item.id}>{JSON.stringify(item)}</li>
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

export default Main;