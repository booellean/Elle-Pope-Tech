import React, { Component } from 'react';
import Page from './PageComponent';

export default class Main extends Component {
  constructor(props){
    super(props);
    this.state = {
    };
  }

  render(){
    return(
      <>
        <main id="main">
        <header id="page-header">
          <h2>This is the {this.props.title} Page</h2>
          <ul>
            <li>There will be options here</li>
          </ul>
        </header>
          <Page />
        </main>
      </>
    );
  }
}