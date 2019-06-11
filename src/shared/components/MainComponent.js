import React, { Component } from 'react';
import Page from './PageComponent';

class Main extends Component {
  constructor(props){
    super(props);
  }

  render(){

    const listItems = JSON.parse(this.props.data).map(  item => {
        return(
          <li>{item.language}</li>
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