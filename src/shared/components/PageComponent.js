import React, { Component } from 'react';

export default class Page extends Component {
  constructor(props){
    super(props);
    this.state = {
    };
  }

  render(){
    return(
      <React.Fragment>
        <p>rendered content will go here</p>
      </React.Fragment>
    );
  }
}